const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check JWT token and attach user to request
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ success: false, message: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    // Fetch user based on the decoded user id
    try {
      const user = await User.findById(decoded.id); // Assuming the user ID is in the JWT payload
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error fetching user" });
    }
  });
};

module.exports = authenticateToken;
