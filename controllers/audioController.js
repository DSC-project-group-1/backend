const uploadAudio = async (req, res) => {
  try {
    // Check if files are uploaded
    const audioFiles = req.files;  // For multiple files
    const audioFile = req.file;    // For single file

    if (!audioFiles && !audioFile) {
      return res.status(400).send('No file uploaded');
    }

    // If multiple files are uploaded
    if (audioFiles && audioFiles.length > 0) {
      // Example: Process multiple audio files
      const transcribedTexts = await Promise.all(audioFiles.map(file => 
        require('../services/speechToTextService').transcribe(file)
      ));

      // Example: Pass transcribed texts to ML service for analysis
      const sentimentResults = await Promise.all(transcribedTexts.map(text => 
        require('../services/mlService').analyzeText(text)
      ));

      return res.status(200).json({ sentiment: sentimentResults });
    }

    // If only a single file is uploaded
    const transcribedText = await require('../services/speechToTextService').transcribe(audioFile);
    const sentimentResult = await require('../services/mlService').analyzeText(transcribedText);

    res.status(200).json({ sentiment: sentimentResult });
  } catch (error) {
    res.status(500).json({ error: 'Error processing audio' });
  }
};

module.exports = { uploadAudio };
