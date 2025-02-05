const express = require('express');
const router = express.Router();
const Chat = require('../model/consult');
const mongoose = require("mongoose");

// fetch patients
router.get("/doctor/:doctorId/patients", async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Convert doctorId to ObjectId if necessary
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    const patients = await Chat.aggregate([
      { $match: { receiverId: doctorObjectId } }, // Ensure doctorId is an ObjectId
      { $group: { _id: "$senderId" } }, // Get unique senderIds
      {
        $lookup: {
          from: "users", // Ensure this matches the actual users collection name
          localField: "_id",
          foreignField: "_id",
          as: "patientDetails",
        },
      },
      { $unwind: "$patientDetails" }, // Extract patient details
      {
        $project: {
          _id: 0,
          patientId: "$patientDetails._id",
          name: "$patientDetails.name",
          email: "$patientDetails.email",
        },
      },
    ]);

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET route to fetch messages between two users (user-to-doctor or doctor-to-user)
router.get("/messages/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    // Find messages where sender and receiver match
    const messages = await Chat.find({
      $or: [
        { senderId, receiverId }, // sender -> receiver
        { senderId: receiverId, receiverId: senderId }, // receiver -> sender
      ],
    }).sort({ timestamp: 1 }); // Sort by timestamp to show messages in order

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

// POST route to send a message
router.post("/messages", async (req, res) => {
  const { senderId, receiverId, text, sender, receiver } = req.body;

  // Validate the data
  if (!senderId || !receiverId || !text || !sender || !receiver) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newMessage = new Chat({
      senderId,
      receiverId,
      text,
      sender,   // sender's role (user or doctor)
      receiver, // receiver's role (user or doctor)
      timestamp: new Date(),
    });

    // Save the message to the database
    await newMessage.save();

    // Return the new message as a response
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Error sending message" });
  }
});


module.exports = router;
