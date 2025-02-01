const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true }, 
    emotion: { type: String, required: true },
    name: {type: String, required: true},
    suggestion: { type: String, required: true }
});

module.exports = mongoose.model('Emotion', emotionSchema);
