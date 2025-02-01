const express = require('express');
const http = require('http')
const cors = require('cors');
const {Server} = require('socket.io')
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const emotionRoutes = require('./routes/emotion');
const serviceRoutes = require('./service/siteQuery');
const chatRoutes = require('./routes/vent');
const chartRoutes = require('./routes/chart');
const progressRoutes = require('./routes/progress');
const mindcareRoutes = require('./routes/mindcare');
const doctorRoutes = require('./routes/doctor');
const Chat = require('./model/consult');
const consultRoutes = require("./routes/consult");

require('dotenv').config();

// Connect to the database
connectDB();

const app = express();

const PORT = process.env.PORT || 7000;

// Middleware
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true
}));

app.options('*', cors()); 

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST'],
    },
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for joining a room
    socket.on('joinRoom', async ({ userId, doctorId }) => {
        const roomId = `room_${userId}_${doctorId}`;
        socket.join(roomId);
        console.log(`User ${userId} joined room: ${roomId}`);
    
        try {
            const chat = await Chat.findOne({ userId, doctorId });
    
            if (chat) {
                io.to(roomId).emit('loadMessages', chat.messages);
            } else {
                io.to(roomId).emit('loadMessages', []);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    });    

    // Listen for a new message
    socket.on('sendMessage', async (data) => {
        const { userId, doctorId, message } = data;
    
        if (!userId || !doctorId || !message) {
            console.error('Invalid message data');
            return;
        }
    
        try {
            let chat = await Chat.findOne({ userId, doctorId });
    
            if (!chat) {
                chat = new Chat({ userId, doctorId, messages: [] });
            }
    
            chat.messages.push({ sender: userId, text: message });
            await chat.save();
    
            const roomId = `room_${userId}_${doctorId}`;
            io.to(roomId).emit('newMessage', chat.messages[chat.messages.length - 1]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });    

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const expireChats = async () => {
    const now = new Date();
    await Chat.updateMany(
      { expiryTime: { $lte: now }, status: "accepted" },
      { $set: { status: "expired" } }
    );
};
  
setInterval(expireChats, 60000); // Check every 1 minute
  

// User Routes
app.use("/api", userRoutes);
app.use("/api", emotionRoutes);
app.use("/api/service", serviceRoutes);
app.use('/api', chatRoutes);
app.use('/api', chartRoutes);
app.use('/api', progressRoutes);
app.use('/api', mindcareRoutes);

//  Doctor Routes
app.use("/api", doctorRoutes);
app.use("/api", consultRoutes);

// Error handler middleware
app.use(errorHandler);

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
