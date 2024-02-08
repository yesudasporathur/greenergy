const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const categorySchema=new Schema({
    name: String,
    delete: Boolean
})

module.exports=mongoose.model("category",categorySchema)