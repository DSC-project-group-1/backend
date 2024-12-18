const axios = require("axios");

const analyzeText = async (req, res) => {
  try {
    console.log("Coming to analyze text");

    // Make GET request to the FastAPI server /predict
    const aiResponse = await axios.get('http://127.0.0.1:8000/predict');
    console.log(aiResponse.data);

    if (!aiResponse.data) {
      return res.status(500).json({ error: 'Error analyzing text' });
    }

    if (!aiResponse.data.predictions) {
      return res.status(500).json({ error: 'No predictions could be generated' });
    }

    const emotionProbabilities = aiResponse.data.predictions;

    const mostLikelyEmotion = Object.entries(emotionProbabilities).reduce(
      (a, b) => (a[1] > b[1] ? a : b),
      [null, 0]
    );

    return res.status(200).json({
      success: true,
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

module.exports = { analyzeText };