const Order=require("../models/order");
const User=require("../models/user");
const Product=require("../models/product");
const dateConvert=require('../public/javascripts/dateConvert')
let title="Orders"


const order_details_get=async(req,res)=>{
const message=req.query.message
let cancel=false
    let order=await Order.findById(req.query._id).populate('items.product')
    if(order.status=="Cancelled"){
        cancel=true
    }
    res.render('user/order-details',{order,title,message,cancel:cancel, cartnum, carttotal})
    console.log("order_details_get")

}

const order_list_get=async(req,res)=>{
    const order=await Order.find({u_id:req.session.user}).populate('items.product')
    res.render('user/order-list',{order,title, cartnum, carttotal,orders:true})
}

const order_cancel_get=async(req,res)=>{
    const _id = req.query._id
    await Order.findOneAndUpdate({_id:_id},{status:"Cancelled"})
    res.redirect(`order-details?message=Order+has+been+cancelled&_id=${_id}`)
    console.log("order_cancel_get")
    console.log(await Order.findOne({_id:_id}))

}

////////////////////////////// Admin Section \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const orders_get=async(req,res)=>{
    const order=await Order.find().populate('u_id').sort({ createdAt: -1 });
    res.render('admin/orders',{title,layout:'admin/layout',order})
}

const order_edit_get=async(req,res)=>{
    const _id=req.query._id
    const order = await Order.findById(_id).populate('u_id').populate('items.product')
    //const datee=dateConvert(order.createdAt)
    //order.createdAt.pull(_id)
    console.log(order)

    res.render('admin/order-edit',{title,order,layout:'admin/layout'})
    console.log("order_edit_get")
}

const order_edit_post=async(req,res)=>{
    const _id=req.body._id
    const notes=req.body.notes
    const status=req.body.status
    const orderUpdate=await Order.findOneAndUpdate({_id:_id},{notes:notes, status:status})
    console.log("order_edit_post")
    res.redirect(`order-edit?message=Order+updated&_id=${_id}`)

}


module.exports={
    order_details_get,
    order_list_get,
    orders_get,
    order_cancel_get,
    order_edit_get,
    order_edit_post
}