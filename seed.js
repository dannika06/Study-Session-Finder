// Fills the database with sample study sessions.
// Run with:            node seed.js
// Wipe and re-seed:    node seed.js --reset

const db = require('./database');

const sampleSessions = [
  { course_name: 'CSS 390', student_name: 'Maya', availability: 'Tue/Thu after 4pm', contact: 'maya@school.edu' },
  { course_name: 'CSS 390', student_name: 'Jordan', availability: 'Weekday mornings', contact: 'jordan@school.edu' },
  { course_name: 'MATH 208', student_name: 'Priya', availability: 'Mon/Wed 2-5pm', contact: 'priya@school.edu' },
  { course_name: 'MATH 208', student_name: 'Sam', availability: 'Sunday evenings', contact: null },
  { course_name: 'BIO 180', student_name: 'Lena', availability: 'Fri afternoons', contact: 'lena@school.edu' },
  { course_name: 'BIO 180', student_name: 'Alex', availability: 'Weekends', contact: null },];

if (process.argv.includes('--reset')) {
  db.prepare('DELETE FROM sessions').run();
  console.log('Cleared existing sessions.');
}

const { count } = db.prepare('SELECT COUNT(*) AS count FROM sessions').get();

if (count > 0) {
  console.log(`Table already has ${count} row(s). Skipping seed.`);
  console.log('Run "node seed.js --reset" to clear it and seed again.');
  process.exit(0);
}

const insert = db.prepare(
  'INSERT INTO sessions (course_name, student_name, availability, contact) VALUES (?, ?, ?, ?)'
);

// Run all inserts as one transaction: either all rows are added or none are.
const insertAll = db.transaction((rows) => {
  for (const row of rows) {
    insert.run(row.course_name, row.student_name, row.availability, row.contact || null);
  }
});

insertAll(sampleSessions);
console.log(`Added ${sampleSessions.length} sample sessions.`);