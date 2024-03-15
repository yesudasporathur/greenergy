const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const wishlistSchema=new Schema({
    u_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    items:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        }
    }]
},{timestamp: true,versionKey:false})

module.exports=mongoose.model("wishlist",wishlistSchema)