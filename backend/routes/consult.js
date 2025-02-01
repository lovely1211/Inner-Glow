const express = require("express");
const router = express.Router();
const Chat = require("../model/consult");

router.post("/sendMessage", async (req, res) => {
  try {
    const { userId, doctorId, sender, text } = req.body; // Get userId dynamically

    if (!userId || !doctorId || !text) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let chat = await Chat.findOne({ userId, doctorId });

    if (!chat) {
        chat = new Chat({ userId, doctorId, messages: [] });
    }
    chat.messages.push({ sender: userId, text: message, replyTo });
    await chat.save();

    res.status(200).json({ success: true, message: "Message sent!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/getMessages/:userId/:doctorId", async (req, res) => {
  try {
    const { userId, doctorId } = req.params;
    const chat = await Chat.findOne({ userId, doctorId });

    if (!chat) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get patients who messaged a specific doctor
router.get("/patients/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // Find distinct patient IDs from chats related to the doctor
    const chats = await Chat.find({ doctorId }).populate("userId", "name");

    // Extract unique patients from chats
    const uniquePatients = [];
    const patientIds = new Set();

    chats.forEach(chat => {
      if (!patientIds.has(chat.userId._id.toString())) {
        patientIds.add(chat.userId._id.toString());
        uniquePatients.push(chat.userId);
      }
    });

    res.status(200).json(uniquePatients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

