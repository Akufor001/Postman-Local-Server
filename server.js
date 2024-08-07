const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Load the JSON data
let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// GET endpoint to retrieve the data
app.get('/users', (req, res) => {
  res.json(data);
});

// POST endpoint to create a new user
app.post('/users', (req, res) => {
  const newUser = req.body;
  data.push(newUser);
  saveData();
  res.status(201).json(newUser);
});

// PUT endpoint to update an existing user
app.put('/users/:name', (req, res) => {
  const name = req.params.name;
  const updatedUser = req.body;
  const index = data.findIndex(user => user.name === name);
  if (index !== -1) {
    data[index] = updatedUser;
    saveData();
    res.json(updatedUser);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// DELETE endpoint to remove a user
app.delete('/users/:name', (req, res) => {
  const name = req.params.name;
  const index = data.findIndex(user => user.name === name);
  if (index !== -1) {
    const deletedUser = data.splice(index, 1)[0];
    saveData();
    res.json(deletedUser);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Function to save the data to the JSON file
function saveData() {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});