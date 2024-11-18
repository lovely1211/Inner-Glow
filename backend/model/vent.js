const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    message: { type: String, required: true },
    reply: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
