const express = require('express');
const router = express.Router();
const { uploadAudio } = require('../controllers/audioController');
const upload = require('../middlewares/multer');

// Define routes for uploading files
// For single file upload, use upload.single('file')
// For multiple file upload, use upload.array('files', maxCount)

router.post('/upload-audio', upload.single('file'), uploadAudio);  // For single file upload

// router.post('/upload-audio', upload.array('files', 10), uploadAudio);  // To accept multiple files (up to 10 files)

module.exports = router;
