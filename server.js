const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const { PORT } = require('./config/serverConfig');
const audioRoutes = require('./routes/audioRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');
const resultRoutes = require('./routes/resultRoutes');
const { initSocket } = require('./sockets/gameSocket');
const errorHandler = require('./utils/errorHandler');

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/audio', audioRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/result', resultRoutes);

// Socket.io setup
const server = app.listen(PORT, () => {
  console.log(`Listening at port number ${PORT}`);
});

initSocket(server);

// Error handling middleware
app.use(errorHandler); 
