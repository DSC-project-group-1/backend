const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/dbConfig');
const { PORT } = require('./config/serverConfig');
const audioRoutes = require('./routes/audioRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');
const resultRoutes = require('./routes/resultRoutes');
const { initSocket } = require('./sockets/gameSocket');
const errorHandler = require('./utils/errorHandler');
const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use('/api/audio', audioRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/result', resultRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/auth', authRoutes);

// Socket.io setup
const server = app.listen(PORT, () => {
  console.log(`Listening at port number ${PORT}`);
});

initSocket(server);

// Error handling middleware
app.use(errorHandler); 
