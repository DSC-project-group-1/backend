const analyzeText = (req, res) => {
  const emotionProbabilities = req.body; // Capture the probabilities from the request body

  if (!emotionProbabilities || Object.keys(emotionProbabilities).length === 0) {
    return res.status(400).send({ error: 'No emotion probabilities received' });
  }

  // Example of additional processing (if needed)
  const mostLikelyEmotion = Object.entries(emotionProbabilities).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    [null, 0]
  );

  res.status(200).send({
    message: 'Emotion analysis completed',
    mostLikelyEmotion: { emotion: mostLikelyEmotion[0], probability: mostLikelyEmotion[1] },
    probabilities: emotionProbabilities,
  });
};

module.exports = { analyzeText };
