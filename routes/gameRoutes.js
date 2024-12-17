const express = require('express');
const router = express.Router();
const { submitGame } = require('../controllers/gameController');

// @route   POST /api/game/submit
// @desc    Submit game results for single-player or two-player mode
// @access  Public (authentication can be added later)
router.post('/submit', submitGame);

module.exports = router;
