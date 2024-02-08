const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const productSchema=new Schema({
    name: String,
    sp: String,
    mrp: String,
    description: String, 
    brand: String,
    category: String,
    images: [
        {
        type: String
        }
    ],
    delete: Boolean
    
})

module.exports=mongoose.model("product",productSchema)