// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Always use absolute path to avoid creating multiple DB copies
const dbPath = path.join(__dirname, 'ecoTrack.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Create or update the activities table (with user column)
db.run(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    name TEXT NOT NULL,
    carbon_saved REAL,
    date TEXT
  )
`);

module.exports = db;
