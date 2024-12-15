const getResult = (req, res) => {
  // Placeholder for retrieving game results
  const gameData = { score: 100, sentiment: 'positive', tone: 'happy' };
  res.status(200).json(gameData);
};

module.exports = { getResult }; 
