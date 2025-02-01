const mongoose = require('mongoose');



const paymentHistorySchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    transactionID: String,
    date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    paymentMethod: { type: String },
    cardDetails: {
      cardNumber: String,
      expiryDate: String,
      cvv: String,
    },
    upiID: String,
    defaultPaymentMethod: { type: String, enum: ['Card', 'UPI', 'Wallet'], default: 'Card' },
    walletBalance: { type: Number, default: 0 },
    paymentHistory: [paymentHistorySchema],
});

module.exports = mongoose.model("User", userSchema);