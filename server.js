const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory storage for user data
const userData = new Map();

// Save user data to file
async function saveUserData() {
  try {
    const data = JSON.stringify([...userData.entries()]);
    await fs.writeFile('user_data.json', data);
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// Load user data from file
async function loadUserData() {
  try {
    const data = await fs.readFile('user_data.json', 'utf8');
    const parsed = JSON.parse(data);
    userData.clear();
    parsed.forEach(([id, user]) => userData.set(id, user));
    console.log(`Loaded ${userData.size} users from file`);
  } catch (error) {
    console.log('No existing user data file found');
  }
}

// Endpoint to save user data
app.post('/userlist', async (req, res) => {
  try {
    const { userId, ...userDataToSave } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    userData.set(userId, {
      ...userDataToSave,
      lastUpdated: Date.now()
    });
    
    await saveUserData();
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Endpoint to get player count
app.get('/player-count', (req, res) => {
  // Simple mock data - in real implementation, this would come from database
  res.json({
    current: Math.floor(Math.random() * 1000) + 500,
    total: Math.floor(Math.random() * 10000) + 5000
  });
});

// Endpoint for real-time player count updates (Server-Sent Events)
app.get('/player-count-stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial data
  res.write(`data: ${JSON.stringify({
    current: Math.floor(Math.random() * 1000) + 500,
    total: Math.floor(Math.random() * 10000) + 5000
  })}\n\n`);

  // Send updates every 5 seconds
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({
      current: Math.floor(Math.random() * 1000) + 500,
      total: Math.floor(Math.random() * 10000) + 5000
    })}\n\n`);
  }, 5000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize the server
async function init() {
  await loadUserData();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

init().catch(console.error);
