const Wishlist=require('../models/wishlist')
const Product=require('../models/product')
let title="Wishlist"

const wishlist= async (req,res)=>{
    const message=req.query.message
    const wishlist=await Wishlist.findOne({u_id:req.session.user}).populate('items.product')
    console.log("wishlist loaded")
    
    res.render('user/wishlist',{wishlist,message,title,cartnum,carttotal})
}
const wishlistAdd= async (req,res)=>{
    const {p_id}=req.body
    let wish=await Wishlist.findOne({u_id:req.session.user})
    if(!wish){
        const newWishlist = await Wishlist.create({u_id:req.session.user})
        console.log("New user wishlist created")
    }
    wish=await Wishlist.findOne({u_id:req.session.user})

        const existingItem=wish.items.find(item=>item.product.toString()===p_id)
        if(!existingItem){
            console.log("New wishlist item")
            wish.items.push({product:p_id})
            await wish.save()
            return res.status(200).send('Item added to wishlist')
        }
        else{
            
            return res.status(200).send("Duplicate wishlist item")

            
        }
    
}


const wishlistRemove=async (req,res)=>{
    const {p_id}=req.query
    const wish=await Wishlist.findOne({u_id:req.session.user})
    const prod=await Product.findOne({_id:p_id})

    
        const existingItem=wish.items.find(item=>item.product.toString()===p_id)
        if(existingItem){
            wish.items.pull({product:p_id})
            await wish.save()
            res.redirect(`/wishlist?message=${prod.name}+removed+from+wishlist.`)  
        }
}
module.exports={
    wishlist,
    wishlistAdd,
    wishlistRemove

}