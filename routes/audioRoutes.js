const express = require('express');
const router = express.Router();
const { uploadAudio } = require('../controllers/audioController');
const upload = require('../middlewares/multer');  // multer instance for handling uploads

// Route to upload audio
router.post('/upload-audio', upload.single('audio'), uploadAudio);  // Single file upload handler

module.exports = router;
