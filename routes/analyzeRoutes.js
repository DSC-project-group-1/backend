const express = require('express');
const router = express.Router();
const { analyzeText } = require('../controllers/analyzeController');

router.get('/analyze', analyzeText);

module.exports = router;
