const socketIo = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A player connected');
    
    // Handle real-time events like score updates
    socket.on('updateScore', (data) => {
      io.emit('scoreUpdate', data);  // Emit updates to all clients
    });

    socket.on('disconnect', () => {
      console.log('A player disconnected');
    });
  });
};

module.exports = { initSocket };
