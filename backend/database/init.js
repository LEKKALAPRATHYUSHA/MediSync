const db = require('./db')
const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, 'schema.sql')

console.log('Looking for schema at:', schemaPath)
console.log('Schema file exists:', fs.existsSync(schemaPath))

if (!fs.existsSync(schemaPath)) {
  console.error('FATAL: schema.sql not found at', schemaPath)
  process.exit(1)
}

const schema = fs.readFileSync(schemaPath, 'utf-8')

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
  if (err) {
    console.error('Init check error:', err.message)
    return
  }
  if (!row) {
    console.log('Fresh database - running schema...')
    db.exec(schema, (execErr) => {
      if (execErr) {
        console.error('Schema Error:', execErr.message)
      } else {
        console.log('Database initialized successfully with seed data')
      }
    })
  } else {
    console.log('Database already initialized')
  }
})