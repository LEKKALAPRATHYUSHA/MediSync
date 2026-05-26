const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite')

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('DB Connection Error:', err.message)
  } else {
    console.log('SQLite Connected at', DB_PATH)
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON')
  }
})

module.exports = db