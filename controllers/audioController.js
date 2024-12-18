const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import the file system module
const axios = require('axios');

// This code is shit and I know it :) didn't have the time to make it better.

const uploadPath = path.join(__dirname, '../../uploads');
const filename = 'record_out.wav';
// Set storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, filename);
  }
});

// File filter to accept only audio files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type, only mp3, wav, mpeg, or webm are allowed.'));
  }
};

// Initialize multer with the storage and file filter options
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
  fileFilter: fileFilter,
});

// Upload audio controller to handle the upload process
const uploadAudio = async (req, res) => {
  const audioFile = req.file; // Single file upload

  if (!audioFile) {
    return res.status(400).send('No file uploaded');
  }
  console.log("File uploaded");

  // Process the uploaded audio file (e.g., transcribe, analyze sentiment, etc.)
  const filePath = path.join(__dirname, `${uploadPath}/${filename}`);
  // const sentimentResult = await require('../controllers/analyzeController').analyzeText();

  try {
    const response = await axios.get('http://127.0.0.1:8000/predict');
    console.log(response.data);
    const emotionProbabilities = response.data.predictions;
    const mostLikelyEmotion = Object.entries(emotionProbabilities).reduce(
      (a, b) => (a[1] > b[1] ? a : b),
      [null, 0]
    );
    return res.status(200).json({
      message: 'Emotion analysis completed',
      mostLikelyEmotion: {
        emotion: mostLikelyEmotion[0],
        probability: mostLikelyEmotion[1]
      },
      probabilities: emotionProbabilities,
    });
  } catch (error) {
    console.error('Error in emotion analysis:', error);
    return res.status(500).json({
      error: 'Error processing emotion analysis',
      details: error.message
    });
  }
};

module.exports = { uploadAudio };