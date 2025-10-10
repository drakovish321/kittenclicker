// server.js
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

// Serve main.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Optional: serve mystery kitten separately
app.get('/mystery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main-mysterykitten-siamese-final.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Kitten Clicker server running on port ${PORT}`));

