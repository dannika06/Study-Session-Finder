const express = require('express');
const db = require('./database'); 
const app = express();

app.use(express.json());
app.use(express.static('public'));

// CREATE a course
app.post('/api/courses', (req, res) => {
  try {
    const { course_name, student_name, availability, contact } = req.body;

    if (typeof course_name !== 'string' || !course_name.trim()) {
      return res.status(400).json({ error: 'course_name is required' });
    }

    const stmt = db.prepare(
      'INSERT INTO sessions (course_name, student_name, availability, contact) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(course_name.trim(), student_name || null, availability || null, contact || null);

    res.status(201).json({
      id: Number(result.lastInsertRowid),
      course_name: course_name.trim(),
      student_name,
      availability,
      contact
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// FIND all courses
app.get('/api/courses', (req, res) => {
  const rows = db.prepare('SELECT * FROM sessions ORDER BY id DESC').all();
  res.json(rows);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});