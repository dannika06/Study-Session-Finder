const Database = require('better-sqlite3');

// Creates (or opens) the database file in the project folder
const db = new Database('study.db');

// Create the table if it doesn't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL,
    student_name TEXT,
    availability TEXT,
    contact TEXT,
    status TEXT DEFAULT 'open'
  )
`);

console.log('Database connected and table ready');
module.exports = db;