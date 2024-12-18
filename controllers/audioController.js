const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import the file system module

// Set storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where the uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, 'record_out.wav'); // Save file as 'record_out.wav'
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
  try {
    const audioFile = req.file; // Single file upload

    if (!audioFile) {
      return res.status(400).send('No file uploaded');
    }
    console.log("File uploaded");

    // Process the uploaded audio file (e.g., transcribe, analyze sentiment, etc.)
    const filePath = path.join(__dirname, '../uploads/record_out.wav');
    const sentimentResult = await require('../controllers/analyzeController').analyzeText(filePath);

    // Delete the file after processing
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully');
      }
    });

    // Send the analysis result
    res.status(200).json({ sentiment: sentimentResult });

  } catch (error) {
    res.status(500).json({ error: 'Error processing audio' });
  }
};

module.exports = { uploadAudio };
