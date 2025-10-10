// server.js - Simple Express server
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Fallback: serve main HTML for all routes (for SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main-mysterykitten-siamese-final.html"));
});

app.listen(PORT, () => {
  console.log(`Kitten Clicker server running on port ${PORT}`);
});
