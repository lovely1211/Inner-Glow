const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const emotionRoutes = require('./routes/emotion');
const serviceRoutes = require('./service/siteQuery');
const chatRoutes = require('./routes/vent');
const chartRoutes = require('./routes/chart');
const progressRoutes = require('./routes/progress')

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 7000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true
}));

app.options('*', cors()); 

// Routes
app.use("/api", userRoutes);
app.use("/api", emotionRoutes);
app.use("/api/service", serviceRoutes);
app.use('/api', chatRoutes);
app.use('/api', chartRoutes);
app.use('/api', progressRoutes);

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
