const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const addressSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    addr1: String,
    addr2: String,
    type: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    phone: Number,
  
});


module.exports = mongoose.model("address", addressSchema);