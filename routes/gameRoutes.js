const express = require('express');
const router = express.Router();

const { submitGame } = require('../controllers/gameController');
router.post('/submit', submitGame);

const { getGameHistory } = require('../controllers/historyController');
const authenticateToken = require('../middlewares/authenticateToken');
router.get('/history', authenticateToken, getGameHistory);


module.exports = router;
