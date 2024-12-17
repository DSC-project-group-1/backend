const User = require('../models/User');

// Fetch user game history
const getGameHistory = async (req, res) => {
  try {
    const user = req.user; // user will be populated by the middleware
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      gameHistory: user.gameHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to retrieve game history" });
  }
};

module.exports = {
  getGameHistory
};
