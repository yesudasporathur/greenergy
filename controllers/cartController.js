const Cart=require("../models/cart")
const Product=require("../models/product")
const Address=require('../models/address')
const Order=require('../models/order')
const numGen=require('../public/javascripts/numGen')
const product = require("../models/product")
const User=require("../models/user");


const cart_view_get=async(req,res)=>{
    const carts=await Cart.findOne({u_id:req.session.user}).populate('items.product')
    res.render('user/cart',{carts, cartnum,carttotal})
}

const add_to_cart_post = async (req, res) => {
    const p_id = req.query.p_id;
    const u_id = req.session.user;

    try {
        let cart = await Cart.findOne({ u_id: u_id });

        if (!cart) {
            cart = await Cart.create({ u_id: u_id });
            console.log("New Cart created: ");
        }
        const product = await Product.findById(p_id);
        
        
        if (!product) {
            return res.status(404).send("Product not found");
        }
        
                
        const existingCartItem = cart.items.find(item => item.product.toString() === p_id);

        
        if (!existingCartItem) {
            cart.items.push({
                product: p_id,
                qty: 1,
                subtotal: product.sp,
                rate: product.sp
            });
        } else {
            if (product.stock <= existingCartItem.qty || !(product.stock!=0)) {
                console.log("Stock out");
                return res.status(400).send("Product stock limited");
            }
            if (existingCartItem.qty==5){
                return res.status(400).send("Max purchase limit reached");

            }
            existingCartItem.qty += 1;
            existingCartItem.subtotal = existingCartItem.qty * product.sp;
        }

        cart.total = cart.items.reduce((total, item) => total + item.subtotal, 0);
        await cart.save();
        console.log("Cart updated: ");




        res.status(200).json({ message: "Product added to cart successfully", quantity: existingCartItem.qty ,subtotal:existingCartItem.subtotal ,total:cart.total, cartnum: cart.items.length});


    } catch (error) {
        console.error("Error adding product to cart: ", error);
        res.status(500).send("Internal server error");
    }
};




const remove_from_cart_post = async (req, res,next) => {
    const p_id = req.query.p_id;
    const u_id = req.session.user;

    try {
        // Find the cart for the user
        const cart = await Cart.findOne({ u_id: u_id });
        const itemIndex = cart.items.findIndex(item => item.product.toString() === p_id);
        if(cart.items[itemIndex].qty == 1){
            res.status(200).json({ message: "Item can only be deleted", cartnum: cart.items.length, quantity: cart.items[itemIndex].qty ,subtotal:cart.items[itemIndex].subtotal,total:cart.total});
            next()
        }
        else{
            if (!cart) {
                return res.status(404).send("Cart not found");
            }
    
            // Find the item in the cart's items array
    
            if (itemIndex === -1) {
                return res.status(404).send("Item not found in cart");
            }
    
            // Decrease the quantity of the item by one
            cart.items[itemIndex].qty -= 1;
    
            // If quantity becomes zero, remove the item from the cart
            if (cart.items[itemIndex].qty === 0) {
                //cart.items.splice(itemIndex, 1);
                res.redirect(`/deleteFromCart?_id=${p_id}`)
                //res.redirect('/cart')
    
            } else {
                // Update the subtotal based on the new quantity
                const product = await Product.findById(p_id);
                cart.items[itemIndex].subtotal = cart.items[itemIndex].qty * product.sp;
            }
    
            // Recalculate the total
            cart.total = cart.items.reduce((total, item) => total + item.subtotal, 0);
    
            // Save the updated cart
            await cart.save();
    
            
            console.log("Item quantity decreased in cart: ");
            res.status(200).json({ message: "Product removed from cart successfully", cartnum: cart.items.length, quantity: cart.items[itemIndex].qty ,subtotal:cart.items[itemIndex].subtotal,total:cart.total});
    

        }
        
    } catch (error) {
        console.error("Error decreasing product quantity in cart: ", error);
        
        res.status(500).send("Internal server error");
    }
};


const delete_from_cart_get = async (req, res) => {
    const p_id = req.query._id;
    const u_id = req.session.user;
    
    try {
        // Find the cart for the user
        const cart = await Cart.findOne({ u_id: u_id });

        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        // Find the index of the item in the cart's items array
        const itemIndex = cart.items.findIndex(item => item.product.toString() === p_id);

        if (itemIndex === -1) {
            return res.status(404).send("Item not found in cart");
        }

        // Remove the item from the cart's items array
        cart.items.splice(itemIndex, 1);

        // Recalculate the total
        cart.total = cart.items.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        console.log("Item deleted from cart: ");
        res.redirect('/cart'); // Redirect to cart page after successful deletion

    } catch (error) {
        console.error("Error deleting item from cart: ", error);
        res.redirect('/cart');
        res.status(500).send("Internal server error");
    }
};

const checkout_get=async(req,res)=>{
    u_id=req.session.user

    const cartDel=await Cart.findOne({u_id:u_id,total:0})
    // if(cartDel.total==0){
    //     return res.redirect('cart')
    // }

    const address=await Address.find({u_id:u_id})
    const cart=await Cart.findOne({u_id:u_id}).populate('items.product')
    res.render('user/checkout',{cart,address})
}

const checkout_post=async(req,res)=>{
    try{
        req.session.payref=numGen(100000000000,999999999999).toString()
        const u_id=req.session.user
    const c_id=req.body.c_id
    const a_id=req.body.a_id
    const paytype=req.body.payment
    const payref=req.session.payref
    const address=await Address.findOne({_id:a_id})
    const cart=await Cart.findOne({_id:c_id})
       const  name= address.name
       const  addr1= address.addr1
       const   addr2= address.addr2
       const   mark= address.mark
       const   city= address.city
       const   state= address.state
        const   country= address.country
        const   pincode= address.pincode
        const   email= address.email
        const  phone= address.phone
        const  type= address.type

       
        



    const newOrder=new Order({
        u_id:u_id,
        items: cart.items,
        total: cart.total,        
            name: name,
            addr1: addr1,
            addr2: addr2,
            mark: mark,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
            email: email,
            phone: phone,
            type: type,        
        paytype: paytype,
        payref: payref,
        status:"Ordered"
    })
    await newOrder.save()
    req.session.orderid=newOrder._id   
    if(paytype=='Razorpay'){
        console.log(cart.total)
        const Razorpay = require('razorpay');
        var instance = new Razorpay({ key_id: process.env.RAZORID, key_secret: process.env.RAZORSECRET })

        const user=await User.findOne({_id:req.session.user})
        const name=user.first_name+" "+user.last_name
        if(cart.total==0){
            total=1
        }
        else{
            total=cart.total
        }
        console.log(total)

        var options = {
        amount: total*100, 
        currency: "INR",
        receipt: payref,
        
        };
        
        instance.orders.create(options, async function(err, order) {
            await Order.findOneAndUpdate({_id:req.session.orderid},{razorder:order.id})



            console.log("Order Created. proceeding to payment")
            res.status(200).json({ order: order, newOrderId: newOrder._id ,RAZORID:process.env.RAZORID,name:name, email:user.email, phone:user.phone});

        });


    cart.items.forEach(async item => {
        const productId = item.product; 
        const qty = item.qty; 
        const prod = await Product.findByIdAndUpdate(
            productId,
            { $inc: { stock: -qty, popularity: qty } }
        );        

    });
    const cartDel=await Cart.findOneAndUpdate({_id:c_id},{items:[],total:0})

    

    }
    
    else{
        res.json(newOrder._id)

    }


    

    }
    catch(error){
        res.render('user/checkout')
        console.error(error)
        res.status(500).json(error)
    }
}

const payId=async(req,res)=>{
    await Order.findOneAndUpdate({_id:req.session.orderid},{razpay:req.query.id})
    const url=`order-details?message=Order+has+been+successfully+placed!&_id=${req.session.orderid}`
    res.status(200).json(url)
}

module.exports={
    cart_view_get,
    add_to_cart_post,
    remove_from_cart_post,
    delete_from_cart_get,
    checkout_get,
    checkout_post,
    payId
}