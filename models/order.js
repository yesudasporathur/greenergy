const mongoose = require("mongoose");
const Counter = require("../models/counter");


const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_id: Number,
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        qty: {
            type: Number,
            default: 1
        },
        subtotal: {
            type: Number,
        }
    }],
    total: {
        type: Number,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address'
    },
    paytype: String,
    payref: Number,
    date: Date,
    time: { type: Date, default: Date.now },
    status: String
}, { timestamps: true, versionKey: false });

// Pre-save middleware to generate sequential order_id
orderSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }

    try {
        const counter = await Counter.findByIdAndUpdate({ _id: 'orderId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.order_id = counter.seq;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("order", orderSchema);
