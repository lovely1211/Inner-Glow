const mongoose = require("mongoose");

const consultSchema = new mongoose.Schema(
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
      receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
      sender: { type: String },
      receiver: { type: String },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model("Consult", consultSchema);
