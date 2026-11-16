const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./database');
const app = express();

app.use(express.json());
app.use(session({
  secret: 'change-me',          // used to sign the session cookie
  resave: false,                // don't re-save sessions that didn't change
  saveUninitialized: false,     // don't create sessions for visitors who never log in
}));
app.use(express.static('public'));

// Middleware to require login for certain routes
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Please log in first' });
  }
  next();
}

// CREATE a course
app.post('/api/courses', requireLogin, (req, res) => {
  const { course_name, student_name, availability } = req.body;

  if (!course_name) {
    return res.status(400).json({ error: 'course_name is required' });
  }

  const stmt = db.prepare(
    'INSERT INTO sessions (course_name, student_name, availability) VALUES (?, ?, ?)'
  );
  const result = stmt.run(course_name, student_name || null, availability || null);

  res.json({
    id: result.lastInsertRowid,
    course_name,
    student_name,
    availability
  });
});

// FIND all courses
app.get('/api/courses', (req, res) => {
  const rows = db.prepare('SELECT * FROM sessions ORDER BY id DESC').all();
  res.json(rows);
});

// Register a new user
app.post('/api/register', (req, res) => {
  try {
    const { username, password } = req.body;

    if (typeof username !== 'string' || !username.trim() ||
        typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Username and a password of 6+ characters are required' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const result = db
      .prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
      .run(username.trim(), hash);

    req.session.userId = Number(result.lastInsertRowid);
    res.status(201).json({ id: req.session.userId, username: username.trim() });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login an existing user
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;

    const user = typeof username === 'string'
      ? db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim())
      : undefined;

    if (!user || typeof password !== 'string' ||
        !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.session.userId = user.id;
    res.json({ id: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});