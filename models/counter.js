const mongoose = require("mongoose");

// Define the counter schema
const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

// Create a static method to fetch and increment the counter
CounterSchema.statics.getNextSequence = async function(name) {
    const counter = await this.findByIdAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
};

// Create the Counter model
const Counter = mongoose.model('Counter', CounterSchema);

// Export the Counter model
module.exports = Counter;
