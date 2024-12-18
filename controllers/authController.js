const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail'); // Import sendEmail function

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

// @desc    User Signup
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
  
      // Generate OTP
      const otp = generateOTP();
  
      // Send OTP to the user's email
      await sendEmail(email, 'Your OTP for Signup', `Your OTP is: ${otp}`);
  
      // Save OTP temporarily (store in memory or database with expiration time)
      req.session.otp = otp;
      req.session.email = email;
      req.session.password = password; // Save the password temporarily in session
      req.session.otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  
      res.status(200).json({
        message: 'OTP sent to your email. Please verify to complete the signup.',
      });
    } catch (error) {
      console.error('Signup Error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // @desc    Verify OTP and Complete Signup
  // @route   POST /api/auth/verify-otp
  // @access  Public
  exports.verifyOTP = async (req, res) => {
    try {
      const { otp } = req.body;
  
      // Check if OTP exists and is valid
      if (!otp) {
        return res.status(400).json({ message: 'OTP is required' });
      }
  
      // Check if OTP is expired
      if (Date.now() > req.session.otpExpiration) {
        return res.status(400).json({ message: 'OTP has expired, please request a new one' });
      }
  
      // Check if OTP matches
      if (otp !== req.session.otp.toString()) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Create user (username auto-generated)
      const user = await User.create({
        email: req.session.email,
        password: req.session.password, // Password is taken from the session
      });
  
      // Clear OTP and user information from session
      delete req.session.otp;
      delete req.session.email;
      delete req.session.password;
      delete req.session.otpExpiration;
  
      // Respond with user details and token
      res.status(201).json({
        message: 'User registered successfully',
        userId: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } catch (error) {
      console.error('OTP Verification Error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// @desc    User Login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Respond with token and user details
    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
