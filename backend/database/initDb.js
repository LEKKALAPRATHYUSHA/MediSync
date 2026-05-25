const db = require('./db')
const fs = require('fs')
const path = require('path')

const schema = fs.readFileSync(
  path.join(__dirname, 'schema.sql'),
  'utf-8'
)

db.exec(schema, (err) => {
  if (err) {
    console.log('Schema Error:', err.message)
  } else {
    console.log('Database initialized successfully')
  }
})