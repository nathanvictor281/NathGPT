const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Data storage for registered users and conversations
const users = {};
const conversations = {};

// Sign-up route
app.get('/signup', (req, res) => {
  res.send(`
    <h1>Sign Up</h1>
    <form action="/signup" method="POST">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit">Sign Up</button>
    </form>
  `);
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Check if username is available
  if (users[username]) {
    return res.status(400).send('Username already exists');
  }

  // Create new user
  users[username] = {
    username,
    password
  };

  res.send('Sign-up successful');
});

// Login route
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit">Log in</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists and password is correct
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid username or password');
  }

  // Store user information in session
  req.session.user = user;

  res.send('Login successful');
});

// Conversations route (requires authentication)
app.get('/conversations', (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const username = req.session.user.username;

  // Retrieve conversations for the logged-in user
  const userConversations = conversations[username] || [];

  res.json(userConversations);
});

// Export the app
module.exports = app;
