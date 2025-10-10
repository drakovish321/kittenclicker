// Express backend for tracking total players
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const totalPlayersFile = path.resolve(__dirname, "totalPlayers.json");
let totalPlayers = 0;
let visitors = new Set();

function loadTotalPlayers() {
  if (fs.existsSync(totalPlayersFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(totalPlayersFile, "utf8"));
      totalPlayers = data.total || 0;
    } catch {
      totalPlayers = 0;
    }
  }
}
function saveTotalPlayers() {
  fs.writeFileSync(totalPlayersFile, JSON.stringify({total: totalPlayers}));
}

loadTotalPlayers();

app.use(express.static(path.join(__dirname, "public"))); // put your HTML in ./public

// Register a new player on POST, just fetch total on GET
app.post("/api/player-visit", (req, res) => {
  // Use a simple cookie-based "session" for unique daily visitors
  let id = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || "") + "_" + (req.headers['user-agent'] || "");
  if (!visitors.has(id)) {
    totalPlayers++;
    saveTotalPlayers();
    visitors.add(id);
    setTimeout(() => visitors.delete(id), 60*60*24*1000); // forget after 1 day
  }
  res.json({total: totalPlayers});
});
app.get("/api/player-visit", (req, res) => {
  res.json({total: totalPlayers});
});

// Serve the HTML as fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main-mysterykitten-siamese-final.html"));
});

app.listen(PORT, () => {
  console.log("Kitten Clicker server running on port", PORT);
});
