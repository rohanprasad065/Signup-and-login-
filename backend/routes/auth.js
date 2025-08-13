const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model
const authMiddleware = require('../authMiddleware');
 // ✅ import middleware

// ========================
// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
// ========================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // Check password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create new user instance
    const newUser = new User({ name, email, password });

    // Save to DB (password hashed by pre-save hook)
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// ========================
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
// ========================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      email: user.email
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// ========================
// @route   GET /api/auth/protected
// @desc    Example of a protected route
// @access  Private (requires JWT)
// ========================
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'You have access!',
    user: req.user // comes from decoded JWT
  });
});

module.exports = router;
