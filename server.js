// server.js
const express = require('express');
const app = express();
const path = require('path');

// In-memory storage for player count (use a database in production)
let playerCount = 0; // Starting count at 0
let activePlayers = new Set(); // Track active players

// Middleware to track active players
app.use((req, res, next) => {
  const clientId = req.headers['x-client-id'] || Date.now() + Math.random();
  
  // Add player to active set
  activePlayers.add(clientId);
  playerCount = activePlayers.size;
  
  // Remove player when connection closes
  req.on('close', () => {
    activePlayers.delete(clientId);
    playerCount = activePlayers.size;
  });
  
  next();
});

app.use(express.static('public'));

// Serve main.html at root
app.get('/', (req, res) => {
  // Increment player count on each visit
  playerCount++;
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Endpoint to get current player count
app.get('/player-count', (req, res) => {
  res.json({ count: playerCount });
});

// Endpoint to get player count with WebSocket support (for real-time updates)
app.get('/player-count-stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Send initial count
  res.write(`data: ${JSON.stringify({ count: playerCount })}\n\n`);
  
  // Send updates every 5 seconds
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ count: playerCount })}\n\n`);
  }, 5000);
  
  // Clean up on connection close
  req.on('close', () => {
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Kitten Clicker server running on port ${PORT}`));
