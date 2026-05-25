const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Create DB file
const db = new sqlite3.Database(
  path.join(__dirname, 'database.sqlite'),
  (err) => {
    if (err) {
      console.log('DB Error:', err.message)
    } else {
      console.log('SQLite Connected')
    }
  }
)

module.exports = db