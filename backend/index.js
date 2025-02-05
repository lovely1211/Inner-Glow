const express = require('express');
const http = require('http')
const cors = require('cors');

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
const messageRoutes = require('./routes/consult');
const setupSocket = require('./utils/socket');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 7000;

const server = http.createServer(app);
const io = setupSocket(server);

// Middleware
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Connect to the database
connectDB();

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
app.use("/api", messageRoutes);

// Error handler middleware
app.use(errorHandler);

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
