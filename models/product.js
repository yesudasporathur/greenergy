const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const productSchema=new Schema({
    sku: Number,
    name: String,
    sp: Number,
    mrp: Number,
    stock: Number,
    discount: Number,
    description: String, 
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    images: [
        {
        type: String
        }
    ],
    delete: Boolean,
    popularity:{
        type:Number,
        default:1
    },
    tags:[{
        type: String
    }],
    rating:{
        type: Number,
        default:0
    },
    review:{
        type:String
    }
    
})

module.exports=mongoose.model("product",productSchema)