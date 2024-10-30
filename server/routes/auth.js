// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth'); // Import the verifyToken middleware

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send('User already exists');

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Invalid credentials');

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      {
        expiresIn: '1h',
      }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).send('Error logging in');
  }
});

// Protected Profile Route
router.get('/profile', verifyToken, (req, res) => {
  // This route is protected by the verifyToken middleware
  res.send(`Hello, user with ID: ${req.user.id}`);
});

module.exports = router;
