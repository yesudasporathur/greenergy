let title="Coupons"
const Coupon=require('../models/coupon')
const Cart=require('../models/cart')

function convertDateFormat(dateString) {
    const [day, month, year] = dateString.split('-');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

const couponList=async (req,res)=>{
    const coupons=await Coupon.find()
    res.render('admin/coupons',{title,layout:'admin/layout',coupons})
    console.log("couponList")
}

const couponAdd=(req,res)=>{
    const message=req.query.message
    res.render('admin/coupon-add',{message,title,layout:'admin/layout'})
    console.log("couponAdd")
}
const couponAdding=async (req,res)=>{
    const {code,description, maxAmount, minAmount, discount, expiryDate}=req.body
    const ifExist=await Coupon.findOne({code:code})
    if(ifExist){
        return res.redirect('/admin/coupon-add?message=Coupon+already+exists')
    }
    const newDate=convertDateFormat(expiryDate)
    const couponEntry=new Coupon({
        code:code,
        description:description,
        maxAmount:maxAmount,
        minAmount:minAmount,
        discount:discount,
        expiryDate:newDate
    })
    await couponEntry.save()
    res.redirect('/admin/coupons')
    console.log("couponAdding")

}

const couponBlock=async (req,res)=>{
    const _id=req.params
    const blocking=await Coupon.findOneAndUpdate({_id},{status:false})
    res.redirect('/admin/coupons')
    console.log("couponBlock")
}
const couponUnblock=async (req,res)=>{
    const _id=req.params
    const blocking=await Coupon.findOneAndUpdate({_id},{status:true})
    res.redirect('/admin/coupons')
    console.log("couponUnblock")
}

const couponDelete=async (req,res)=>{
    const _id=req.params
    const blocking=await Coupon.findOneAndDelete({_id})
    res.redirect('/admin/coupons')
    console.log("couponDelete")
}


const couponApply=async (req,res)=>{
    let message="Coupon code invalid"
    const {code}=req.body || req.query
    const checkCoupon=await Coupon.findOne({code:code})
    const cart = await Cart.findOne({ u_id: req.session.user });
    if(!checkCoupon){
        return res.redirect(`/cart?coupon=${message}`)
    }
    if(checkCoupon.used==false){
        const newTotal = cart.total - checkCoupon.discount;
        const applyCoupon=await Cart.findOneAndUpdate({u_id:req.session.user},{
            coupon:checkCoupon,
            total:newTotal
        })
        message="Coupon applied"
        //const couponUsed=await Coupon.findOneAndUpdate({code:code},{used:true})

    }
    else{
        message="Coupon already used before"
    }
    

    console.log("couponApply")
    res.redirect(`/cart?coupon=${message}`)
}

const couponApplyAvail=async (req,res)=>{
    let message="Coupon code invalid"
    const {code}=req.params
    const checkCoupon=await Coupon.findOne({code:code})
    const cart = await Cart.findOne({ u_id: req.session.user });
    if(!checkCoupon){
        return res.redirect(`/cart?coupon=${message}`)
    }
    if(checkCoupon.used==false){
        const newTotal = cart.total - checkCoupon.discount;
        const applyCoupon=await Cart.findOneAndUpdate({u_id:req.session.user},{
            coupon:checkCoupon,
            total:newTotal
        })
        message="Coupon applied"
        //const couponUsed=await Coupon.findOneAndUpdate({code:code},{used:true})

    }
    else{
        message="Coupon already used before"
    }

    

    console.log("couponApplyAvail")
    res.redirect(`/cart?coupon=${message}`)
}


const couponRemove=async (req,res)=>{
    const { c_id,cart_id}=req.query
    const usedChange=await Coupon.findByIdAndUpdate({_id:c_id},{used:false})
    const discount=usedChange.discount
    console.log(discount)
    const cartChange=await Cart.findByIdAndUpdate({_id:cart_id},{
        coupon:null,
        $inc: {total:discount}
    })
    res.redirect("/cart?coupon=Coupon+discount+removed")
}

const couponEdit=async (req,res)=>{
    const _id=req.query
    const coupon=await Coupon.findById(_id)
    res.render('admin/coupon-edit',{layout:'admin/layout',coupon})
    console.log("couponEdit")
}

const couponEditing=async(req,res)=>{
    const {_id,code,description, maxAmount, minAmount, discount, expiryDate}=req.body
    const newDate=convertDateFormat(expiryDate)
    const couponEntry=await Coupon.findByIdAndUpdate(_id,{
        code:code,
        description:description,
        maxAmount:maxAmount,
        minAmount:minAmount,
        discount:discount,
        expiryDate:newDate
    })
    res.redirect('/admin/coupons')
    console.log("couponAdding")

}

const coupons=async (req, res) => {
    const cart=await Cart.findOne({u_id:req.session.user})
    const total=cart.subtotal
    function convertUnixToISOString(unixTimestamp) {
        const date = new Date(unixTimestamp);
        return date.toISOString();
    }
    
    const unixTimestamp = Date.now(); 
    const dateNow = convertUnixToISOString(unixTimestamp);
    console.log(dateNow);
    
    
    const coupons = await Coupon.find({maxAmount:{$gte:total},expiryDate:{$gte:dateNow},minAmount:{$lte:total},status:true, used:false})

    console.log(coupons)
  
    res.json(coupons);
  }

module.exports={
    couponList,
    couponAdd,
    couponAdding,
    couponBlock,
    couponUnblock,
    couponDelete,
    couponApply,
    couponRemove,
    coupons,
    couponApplyAvail,
    couponEdit,
    couponEditing
}