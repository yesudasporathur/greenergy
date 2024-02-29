const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const addressSchema = new Schema({
    default: Boolean,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: String,
    addr1: String,
    addr2: String,
    mark: String,
    type: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    email: String,
    phone: Number,
    type: Boolean  
});


module.exports = mongoose.model("address", addressSchema);