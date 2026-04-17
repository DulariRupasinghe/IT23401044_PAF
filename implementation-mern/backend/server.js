const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Route
const userRoute = require('./routes/userRoutes');
const moduleRoute = require('./routes/moduleRoutes');
const attendanceRoute = require('./routes/attendance.routes'); // Note the alternative filename
const feedbackRoute = require('./routes/feedbackRoutes');
const faqRoute = require('./routes/faqRoutes');
const reportRoute = require('./routes/reportRoutes');
const notificationRoute = require('./routes/notificationRoutes');

app.use('/api/users', userRoute);
app.use('/api/modules', moduleRoute);
app.use('/api/attendance', attendanceRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/faq', faqRoute);
app.use('/api/reports', reportRoute);
app.use('/api/notifications', notificationRoute);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the MERN Startup! API is working.' });
});

// Sample API Route
app.get('/api/message', (req, res) => {
    res.json({ 
        status: 'Success', 
        data: 'Hello from the Node.js/Express backend!',
        timestamp: new Date()
    });
});

// Database Connection with Remote Support
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri || uri.includes('<db_username>')) {
            console.error('⚠️  No valid MONGODB_URI found in .env. Please update it with your Atlas connection string.');
            return;
        }

        await mongoose.connect(uri, {
            // Options for remote stability
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ MongoDB Atlas connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        // Retry logic or graceful degradation could be added here
    }
};

connectDB();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
