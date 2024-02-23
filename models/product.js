const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const productSchema=new Schema({
    name: String,
    sp: Number,
    mrp: Number,
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
    delete: Boolean
    
})

module.exports=mongoose.model("product",productSchema)