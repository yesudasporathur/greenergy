const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const cartSchema=new Schema({
    u_id:{
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
            type: Number,
        },
        rate:{
            type:Number
        }
    }],
    subtotal: Number,
    total:{
        type:Number,
    },
    coupon:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'coupon'
    }    
},{timestamp: true,versionKey:false})

module.exports=mongoose.model("cart",cartSchema)