const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    discount: {
        type: Number,
        required: true
    },
    minAmount: {
        type: Number,
        required: true
    },
    maxAmount: {
        type: Number,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    },
    used: {
        type: Boolean,
        default: false 
    },
    temp:{
        type: Boolean

    }
});

module.exports = mongoose.model("coupon", couponSchema);
