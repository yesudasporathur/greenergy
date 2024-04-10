const Order=require("../models/order");
const User=require("../models/user");
const Product=require("../models/product");
const Wallet=require('../models/wallet')

const dateConvert=require('../public/javascripts/dateConvert')
let title="Orders"
//const pdf = require('html-pdf');
const fs = require('fs');
// const express = require('express');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const product = require("../models/product");
const order = require("../models/order");
// const { generate } = require("otp-generator");
// const { find } = require("../models/brand");


const orderDetailsLoad=async(req,res)=>{
    try{
        const _id=req.query._id
        const message=req.query.message

        let cancel=false,revise=false
        let order=await Order.findById(_id).populate('items.product')
        if(order.cancel || order.reqCancel){
            cancel=true
            //await Order.findByIdAndUpdate({_id},{cancel:true})
        }
        if(order.paytype=="Razorpay" && !order.razpay){
            revise = true
        }
        res.render('user/order-details',{user: req.session.user,revise:revise, order,title,message,cancel:cancel, cartnum, carttotal})
        console.log("order_details_get")
    }
    catch(err){
        console.log(err)
    }

}

const OrderListLoad=async(req,res)=>{
    const order=await Order.find({u_id:req.session.user}).populate('items.product').sort({createdAt:-1})
    res.render('user/order-list',{order,title, cartnum, user: req.session.user,carttotal,orders:true})
}

const orderListPagin=async (req,res)=>{
    const {page,limit}=req.body
    let skip=(page-1)*limit
    const count=await Order.countDocuments({u_id:req.session.user}).populate('items.product')
    const orders=await Order.find({u_id:req.session.user}).populate('items.product').sort({createdAt:-1}).skip(skip).limit(limit);
    const pages=Math.floor(count/limit)
    console.log(orders)
    res.status(200).json({orders,pages})
}

const orderCancelLoad=async(req,res)=>{
    const _id = req.query._id
    await Order.findOneAndUpdate({_id:_id},{status:"Cancel Requested",reqCancel:true})
    if(!order.delivered)
    {
        console.log("order delivered false")
        await Order.findOneAndUpdate({_id:_id},{ cancelled:true, refundStarted:true})
        if(order.razpay){
            walletRefund(_id)
        }
        await Order.findOneAndUpdate({_id:_id},{status:"Refunded", refunded:true})
    }
    res.redirect(`order-details?message=Order+has+been+cancelled&_id=${_id}`)
    console.log("order_cancel_get")
    console.log(await Order.findOne({_id:_id}))

}

const orderInvoice=async (req, res) => {
        try {
            const {_id}=req.body
                const orderDetails = await Order.findOne
    
            const htmlTemplate = fs.readFileSync(path.join(__dirname, 'invoice_template.html'), 'utf-8');
    
            let itemsHtml = '';
            for (const item of orderDetails.items) {
                itemsHtml += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}</td>
                        <td>${item.quantity * item.price}</td>
                    </tr>
                `;
            }
    
            const renderedHtml = htmlTemplate.replace('{{orderId}}', orderDetails.orderId)
                                             .replace('{{customerName}}', orderDetails.customerName)
                                             .replace('{{items}}', itemsHtml);
    
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
    
            await page.setContent(renderedHtml);
    
            const pdfBuffer = await page.pdf({ format: 'A4' });
    
            await browser.close();
    
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
    
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('Internal Server Error');
        }

}

////////////////////////////// Admin Section \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const orders_get=async(req,res)=>{
    const order=await Order.find().populate('u_id').sort({ createdAt: -1 });
    res.render('admin/orders',{title,layout:'admin/layout',order})
}

const order_edit_get=async(req,res)=>{
    const _id=req.query._id
    const order = await Order.findById(_id).populate('u_id').populate('items.product')
    
    console.log(order)

    res.render('admin/order-edit',{title,order,layout:'admin/layout'})
    console.log("order_edit_get")
}

const order_edit_post=async(req,res)=>{
    const _id=req.body._id
    const notes=req.body.notes
    const status=req.body.status
    try{
        switch(status){
            case 'Dispatched':
                orderUpdate=await Order.findOneAndUpdate({_id:_id},{notes:notes, status:status, dispatched:true})
                break;
            case 'In Transit':
                orderUpdate=await Order.findOneAndUpdate({_id:_id},{notes:notes, status:status, inTransit:true})
                break;
            case 'Delivered':
                orderUpdate=await Order.findOneAndUpdate({_id:_id},{notes:notes, status:status, delivered:true})
                break;
            case 'Cancelled':
                orderUpdate=await Order.findOneAndUpdate({_id:_id},{notes:notes, status:status, cancelled:true})
                break;
            case 'Returned':
                orderUpdate=await Order.findOneAndUpdate({_id:_id},{notes:notes, status:status, returned:true})
                break;
            case 'Refund Started':
                orderUpdate=await Order.findOneAndUpdate({_id:_id},{notes:notes, status:status, refundStarted:true})
                break;
            case 'Refund Complete':
                if(orderUpdate.delivered){//delivered - online and cod is returned
                    walletRefund(_id)
                    orderUpdate=await Order.findOneAndUpdate({_id:_id},{notes:notes, status:status, refunded:true})
                }
                else if(!orderUpdate.delivered && orderUpdate.razpay){ //not delivered - only online payments are refunded
                    walletRefund(_id)
                    orderUpdate=await Order.findOneAndUpdate({_id:_id},{notes:notes, status:"Refund Complete", refunded:true})
                }
                else{

                }
                break;
            default:
                break;
        }
        return res.redirect(`order-edit?message=Order+updated&_id=${_id}`)
    }
    catch(err){
        console.log("order_edit_post")
        res.redirect(`order-edit?message=Unknown+error&_id=${_id}`)
    }    
}

async function walletRefund(_id){
    const order = await Order.findOne({_id:_id})
    const walletRefunding=await Wallet.findOne({u_id:order.u_id})
    walletRefunding.balance+=order.total
    const newAction={
        credit:true,
        amount:order.total,
        current: walletRefunding.balance,
        o_id: order.order_id
    }
    walletRefunding.action.push(newAction)
    await walletRefunding.save()
    return
}

const cancelOrder=async(req,res)=>{
    const {_id}=req.query
    const cancelling=await Order.findByIdAndUpdate({_id:_id},{status:"Cancelled", reqCancel:true})
    res.redirect(`order-edit?message=Order+updated&_id=${_id}`)

}

const orderList=(req,res)=>{
    res.render('admin/orders',{layout:'admin/layout'})
    console.log("orderList");
}

const filterFn=async(search,startDate,endDate,page,limit,sort)=>{
    if(!startDate){
        startDate=0
    }
    if(!endDate){
        endDate=Date.now()
    }
    if(!page){
        page=1
    }
    let skip=(page-1)*limit
    switch(sort){
        default: sorting={order_id:-1}
    }
    let findFn={name: { $regex: new RegExp(search, 'i') },createdAt:{$gte:startDate,$lte:endDate}};
    const count=await Order.countDocuments(findFn)
    const overall=await Order.find(findFn).populate('u_id')
    const orders=await Order.find(findFn).populate('u_id').sort(sorting).skip(skip).limit(limit);
    const subtotal = overall.reduce((acc, order) => acc + order.subtotal, 0);
    const discount = overall.reduce((acc, order) => acc + order.coupondiscount, 0);
    const total = overall.reduce((acc, order) => acc + order.total, 0);
    let pages=Math.ceil(count/limit)
    return {overall,orders,pages,page,count,subtotal,discount,total}
}

const orderFilter=async (req,res)=>{
    try{
        let {search,startDate,endDate,page,limit,sort}=req.body        
        res.json(await filterFn(search,startDate,endDate,page,limit,sort))
        console.log("orderFilter");
    }
    catch{
        res.status(500).json("Error occured")
    }

}

const generatePdf = async (req, res) => {
    try {
        let { search, startDate, endDate, page, limit, sort } = req.body;

        const { overall, subtotal, discount, total ,count} = await filterFn(search, startDate, endDate, page, limit, sort);
        const htmlContent = fs.readFileSync('./views/admin/order-list-pdf.hbs', 'utf8');
        const template = handlebars.compile(htmlContent);

        
        let tableContent = `
            <table class="table border my-5" style="font-size: 10px">
                <thead>
                    <tr class="bg-primary-subtle">
                        <th scope="col">No.</th>
                        <th scope="col">Name</th>
                        <th scope="col">Subtotal</th>
                        <th scope="col">Discount</th>
                        <th scope="col">Total</th>
                        <th scope="col">Status</th>
                        <th scope="col">Order Date</th>
                    </tr>
                </thead>
                <tbody>
        `;

        overall.forEach((item, index) => {
            tableContent += `
                <tr>
                <td>${item.order_id}</td>
                <td>${item.u_id.first_name} ${item.u_id.last_name}</td>
                <td>${item.subtotal}</td>
                <td>${item.coupondiscount}</td>
                <td>${item.total}</td>
                <td>${item.status}</td>
                <td>${dateConvert(item.createdAt)}</td>
                </tr>
            `;
        });

        tableContent += `
                </tbody>
            </table>
        `;
        const renderedHtml = template( {tableContent, subtotal, discount, total,count} );

        const browser = await puppeteer.launch();
        const paged = await browser.newPage();

        const marginOptions = {
            top: '1cm',
            bottom: '1cm',
            left: '1cm',
            right: '1cm'
        };

        await paged.setContent(renderedHtml);
        const pdfBuffer = await paged.pdf({
            format: 'A4',
            margin: marginOptions
        });

        await browser.close();

        res.setHeader('Content-Disposition', 'inline; filename="Sales Report"');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Error generating PDF" });
    }
};

const generateCsv=async(req,res)=>{
    try {
        let { search, startDate, endDate, page, limit, sort } = req.body;

        const { overall, subtotal, discount, total ,count} = await filterFn(search, startDate, endDate, page, limit, sort);
        console.log(1)
        // Define the path where you want to save the CSV file
        const csvFilePath = './overall.csv';

        // Define the CSV writer
        const csvWriter = createObjectCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'order_id', title: 'Order ID' },
                { id: 'name', title: 'Name' },
                { id: 'subtotal', title: 'Subtotal' },
                { id: 'coupondiscount', title: 'Discount' },
                { id: 'total', title: 'Total' },
                { id: 'status', title: 'Status' },
                { id: 'createdAt', title: 'Order Date' }
            ]
        });

        // Write data to CSV file
        await csvWriter.writeRecords(overall);

        // Send the CSV file as response
        res.download(csvFilePath, 'overall.csv', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ error: 'Error sending file' });
            } else {
                // Remove the CSV file after it's been sent
                fs.unlinkSync(csvFilePath);
            }
        });
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({ error: 'Error generating CSV' });
    }
}


const invoicePdf=async (req,res)=>{
        try {
            const { _id } = req.body;    
            const orderDetails=await Order.findById(_id).populate('items.product')
            const htmlContent = fs.readFileSync('./views/user/invoice-pdf.hbs', 'utf8');
            const template = handlebars.compile(htmlContent);
            const {name , addr1,addr2,state,country,city,pincode,order_id}=orderDetails
            let discount,shipping
            if(orderDetails.coupondiscount==NaN){
                discount=orderDetails.coupondiscount

            }
            else{
                discount="NA"
            }
            if(orderDetails.shipping==NaN){
                shipping=orderDetails.shipping

            }
            else{
                shipping="NA"
            }
    
            
            let tableContent = `
                <table class="table border my-5" style="font-size: 10px">
                    <thead>
                        <tr class="bg-primary-subtle">
                            <th scope="col">SKU</th>
                            <th scope="col">Name</th>
                            <th scope="col">Rate</th>
                            <th scope="col" style="width:80px">Quantity</th>
                            <th scope="col">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
    
            orderDetails.items.forEach((item, index) => {
                tableContent += `
                    <tr>
                    <td>${item.product.sku}</td>
                    <td>${item.product.name}</td>
                    <td>${item.rate}</td>
                    <td>${item.qty}</td>
                    <td>${item.subtotal}</td>
                    </tr>
                `;
            });
            tableContent += `
                    <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Total<br>Discounts<br>Shipping<br><span style="color:blue">Grand Total</span></td>
                    <td>${orderDetails.subtotal}<br>${discount}<br>${shipping}<br><span style="color:blue">${orderDetails.total}</span></td>
                    </tr>
                `;    
            tableContent += `
                    </tbody>
                </table>
            `;
            const renderedHtml = template( {tableContent,name , addr1,addr2,state,country,city,pincode,order_id} );
    
            const browser = await puppeteer.launch();
            const paged = await browser.newPage();
    
            const marginOptions = {
                top: '1cm',
                bottom: '1cm',
                left: '1cm',
                right: '1cm'
            };
    
            await paged.setContent(renderedHtml);
            const pdfBuffer = await paged.pdf({
                format: 'A4',
                margin: marginOptions
            });
    
            await browser.close();
    
            res.setHeader('Content-Disposition', 'inline; filename="Invoice"');
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfBuffer);
        } catch (error) {
            console.error("Error generating PDF:", error);
            res.status(500).json({ error: "Error generating PDF" });
        }
}

module.exports={
    orderDetailsLoad,
    OrderListLoad,
    orders_get,
    orderCancelLoad,
    order_edit_get,
    order_edit_post,
    orderInvoice,
    orderFilter,
    orderList,
    generatePdf,
    generateCsv,
    cancelOrder,
    invoicePdf,
    orderListPagin
}