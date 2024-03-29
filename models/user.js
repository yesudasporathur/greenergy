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

// Pre-save hook to generate referral code
userSchema.pre('save', function(next) {
  if (!this.referral) {
    this.referral = generateReferralCode(6);
  }
  next();
});

// Function to generate random alphanumeric string
function generateReferralCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

module.exports = mongoose.model("user", userSchema);
