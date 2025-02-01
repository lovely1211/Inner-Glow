const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const consultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    messages: [messageSchema],
    expiryTime: { type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 } // Expiry in 7 days
});

module.exports = mongoose.model("Consult", consultSchema);
