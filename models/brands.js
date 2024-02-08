const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const brandSchema=new Schema({
    name: String, 
    brand: String,
    category: String,
    images: String
})

module.exports=mongoose.model("brand",categorySchema)