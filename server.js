// server.js
const express = require('express');
const app = express();
const path = require('path');

// In-memory storage for player counts
let currentPlayers = 0; // Players currently connected
let totalPlayers = 0;   // Total players who have ever played
let activePlayers = new Set(); // Track active players

// Middleware to track active players
app.use((req, res, next) => {
  const clientId = req.headers['x-client-id'] || Date.now() + Math.random();
  
  // Add player to active set
  activePlayers.add(clientId);
  currentPlayers = activePlayers.size;
  totalPlayers = Math.max(totalPlayers, currentPlayers); // Update total if needed
  
  // Remove player when connection closes
  req.on('close', () => {
    activePlayers.delete(clientId);
    currentPlayers = activePlayers.size;
  });
  
  next();
});

app.use(express.static('public'));

// Serve main.html at root
app.get('/', (req, res) => {
  // Increment total player count on each visit
  totalPlayers++;
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Endpoint to get current player count
app.get('/player-count', (req, res) => {
  res.json({ 
    current: currentPlayers,
    total: totalPlayers 
  });
});

// Endpoint to get player count with Server-Sent Events for real-time updates
app.get('/player-count-stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Send initial count
  res.write(`data: ${JSON.stringify({ current: currentPlayers, total: totalPlayers })}\n\n`);
  
  // Send updates every 5 seconds
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ current: currentPlayers, total: totalPlayers })}\n\n`);
  }, 5000);
  
  // Clean up on connection close
  req.on('close', () => {
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Kitten Clicker server running on port ${PORT}`));
