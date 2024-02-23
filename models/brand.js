const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const brandSchema=new Schema({
    name: String, 
    brand: String,
    image: String,
    delete: Boolean
})

module.exports=mongoose.model("brand",brandSchema)