const express = require('express');
const db = require('./database'); 
const app = express();

app.use(express.json());
app.use(express.static('public'));

// CREATE a course
app.post('/api/courses', (req, res) => {
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

// DELETE a session
app.delete('/api/courses/:id', (req, res) => {
  const { id } = req.params;

  const result = db.prepare('DELETE FROM sessions WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});