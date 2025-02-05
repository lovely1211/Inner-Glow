const socketIo = require('socket.io');
const Chat = require('../model/consult');

// Store Active Users
let onlineUsers = {};

const setupSocket = (server) => {
  const io = socketIo(server)
  
// Socket.io Connection
io.on("connection", (socket) => {
  console.log("New user connected", socket.id);

  // User joins chat (doctor or user)
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} is online`);
  });

  // Send message
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    const chat = new Chat({ senderId, receiverId, text });
    await chat.save();

    // Send message to the receiver if online
    if (onlineUsers[receiverId]) {
      io.to(onlineUsers[receiverId]).emit("receiveMessage", { senderId, text });
    }
  });

  // User disconnects
  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find((key) => onlineUsers[key] === socket.id);
    if (userId) delete onlineUsers[userId];
    console.log("User disconnected", socket.id);
  });
});
}

module.exports = setupSocket;
