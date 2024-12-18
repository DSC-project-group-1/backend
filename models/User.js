const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  username: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return `user_${Math.random().toString(36).substr(2, 9)}`;
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gameHistory: [
    {
      gameId: { type: mongoose.Schema.Types.ObjectId, auto: true },
      date: { type: Date, default: Date.now },
      mode: { type: String, enum: ['Single', 'Two-Player'], required: true }, // Game Mode
      prompt: { type: String, required: true },
      player1: {
        text: { type: String },
        sentiment: { type: String },
        tone: { type: String },
        score: {
          accuracy: { type: Number, default: 0 },
          intensity: { type: Number, default: 0 },
          total: { type: Number, default: 0 },
        },
      },
      player2: {
        text: { type: String },
        sentiment: { type: String },
        tone: { type: String },
        score: {
          accuracy: { type: Number, default: 0 },
          intensity: { type: Number, default: 0 },
          total: { type: Number, default: 0 },
        },
      },
      winner: {
        type: String,
        enum: ['Player1', 'Player2', 'AI', 'Tie', null],
        default: null,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Hash Password Before Saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare Password
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
