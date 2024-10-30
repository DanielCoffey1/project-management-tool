// index.js
const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth'); // Import auth routes
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/project-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Middleware
app.use(express.json()); // Middleware to parse JSON data
app.use('/api/auth', authRoute); // Mount the auth routes at /api/auth

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
