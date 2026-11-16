const Database = require('better-sqlite3');

// Creates (or opens) the database file in the project folder
const db = new Database('study.db');

// Create the tables if they don't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL,
    student_name TEXT,
    availability TEXT,
    status TEXT DEFAULT 'open',
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );
`);

console.log('Database connected and table ready');
module.exports = db;