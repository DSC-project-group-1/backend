const User = require('../models/User');

// Generate AI Score for Single-Player Mode
function generateAIScore() {
  return {
    accuracy: Math.floor(Math.random() * 100),
    intensity: Math.floor(Math.random() * 100),
    total: Math.floor(Math.random() * 200),
  };
}

// Determine Winner
function determineWinner(score1, score2) {
  if (score1 > score2) return 'Player1';
  if (score2 > score1) return 'Player2';
  return 'Tie';
}

// Submit Game Results Controller
exports.submitGame = async (req, res) => {
  try {
    const { userId, mode, prompt, player1Input, player2Input } = req.body;

    // Validate input
    if (!userId || !mode || !prompt || !player1Input) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find User (Player1)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Player1 not found' });

    let winner = null;

    if (mode === 'Single') {
      // AI acts as Player2
      const aiScore = generateAIScore();
      winner = determineWinner(player1Input.score.total, aiScore.total);

      user.gameHistory.push({
        mode: 'Single',
        prompt,
        player1: player1Input,
        player2: {
          text: 'AI-generated response',
          sentiment: 'neutral',
          tone: 'neutral',
          score: aiScore,
        },
        winner: winner === 'Player1' ? 'Player1' : 'AI',
      });
    } else if (mode === 'Two-Player') {
      // Player1 vs Player2
      if (!player2Input) {
        return res.status(400).json({ message: 'Player2 input is required for Two-Player mode' });
      }

      winner = determineWinner(player1Input.score.total, player2Input.score.total);

      user.gameHistory.push({
        mode: 'Two-Player',
        prompt,
        player1: player1Input,
        player2: player2Input,
        winner,
      });
    } else {
      return res.status(400).json({ message: 'Invalid game mode' });
    }

    // Save updated user data
    await user.save();

    res.status(200).json({
      message: 'Game history recorded successfully',
      gameData: user.gameHistory[user.gameHistory.length - 1],
    });
  } catch (error) {
    console.error('Error submitting game:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
