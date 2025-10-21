// server.js
const express = require('express');
const app = express();
const path = require('path');

// In-memory storage for player count (use a database in production)
let playerCount = 0; // Starting count at 0

app.use(express.static('public'));

// Serve main.html at root
app.get('/', (req, res) => {
  // Increment player count on each visit
  playerCount++;
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to get current player count
app.get('/player-count', (req, res) => {
  res.json({ count: playerCount });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Kitten Clicker server running on port ${PORT}`));
