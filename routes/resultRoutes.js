const express = require('express');
const router = express.Router();
const { getResult } = require('../controllers/resultController');

router.get('/result', getResult);

module.exports = router;
