const db = require('./db')
const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, 'schema.sql')
if (!fs.existsSync(schemaPath)) {
  console.error('Schema file not found at:', schemaPath)
  process.exit(1)
}
const schema = fs.readFileSync(schemaPath, 'utf-8')

// Check if users table exists (i.e., DB already initialized)
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
  if (err) {
    console.error('Init check error:', err.message)
    return
  }

  if (!row) {
    // Fresh DB - run schema
    db.exec(schema, (execErr) => {
      if (execErr) {
        console.error('Schema Error:', execErr.message)
      } else {
        console.log('Database initialized with schema and seed data')
      }
    })
  } else {
    console.log('Database already initialized')
  }
})