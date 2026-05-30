// server.js - Main entry point for the backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import route files
const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');

// Initialize express app
const app = express();

// Middleware
app.use(cors());                    // Allows frontend to call backend
app.use(express.json());            // Parses JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);

// Test route to check if server is running
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
  });