const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const cartSchema=new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    items:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        qty:{
            type: Number,
            default: 1
        },
        subtotal:{
            type: Number
        }
}],
    
    
},{timestamp: true})

module.exports=mongoose.model("cart",cartSchema)