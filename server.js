// server.js
const express = require('express');
const app = express();
const path = require('path');

// In-memory storage for player count (use a database in production)
let playerCount = 1234; // Starting count

app.use(express.static('public'));

// Serve main.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to get current player count
app.get('/player-count', (req, res) => {
  res.json({ count: playerCount });
});

// Endpoint to reset player count
app.post('/reset-player-count', (req, res) => {
  playerCount = 1234;
  res.json({ count: playerCount });
});

// Optional: endpoint to increment player count (for tracking visits)
app.post('/increment-player-count', (req, res) => {
  playerCount++;
  res.json({ count: playerCount });
});

// Optional: serve mystery kitten separately
app.get('/mystery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main-mysterykitten-siamese-final.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Kitten Clicker server running on port ${PORT}`));
