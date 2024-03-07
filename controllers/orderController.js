const Order=require("../models/order");
let title="Orders"


const order_details_get=(req,res)=>{
    console.log("Order Placed")
    res.redirect('shop')
}

module.exports={
    order_details_get
}