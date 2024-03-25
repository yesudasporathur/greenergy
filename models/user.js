const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  first_name: String,
  last_name: String,
  phone: String,
  password: String,
  block: Boolean,
  isAdmin: Boolean,
  referral: String,
  isRefer: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  address: {
    addr1: String,
    addr2: String,
    type: String,
    city: String,
    state: String,
    country: String,
    pincode: String,    
  
  },
});


module.exports = mongoose.model("user", userSchema);