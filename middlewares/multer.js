const multer = require('multer');
const path = require('path');

// Set storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where the uploaded files will be stored
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp and original file name
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter to allow only certain file types (e.g., audio)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only mp3, wav, or mpeg are allowed.'));
  }
};

// Initialize multer with storage and file filter options
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
  fileFilter: fileFilter,
});

// Export upload functions for single or multiple file uploads
module.exports = upload;
