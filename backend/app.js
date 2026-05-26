require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

// ========================
// MIDDLEWARE
// ========================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ========================
// INIT DATABASE (SAFE FIX)
// ========================
// Only load if file exists (prevents crash)
try {
  require('./database/init')
} catch (err) {
  console.warn('Database init file not found, skipping DB init...')
}

// ========================
// ROUTES
// ========================
const authRoutes = require('./routes/authRoutes')
const slotRoutes = require('./routes/slotRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const patientRecordRoutes = require('./routes/patientRecordRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/doctor-slots', slotRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/patient-records', patientRecordRoutes)
app.use('/api/dashboard', dashboardRoutes)

// ========================
// FRONTEND STATIC FILES
// ========================
app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

// ========================
// HEALTH CHECK
// ========================
app.get('/', (req, res) => {
  res.json({ message: 'MediSync API is running' })
})

// ========================
// ERROR HANDLER
// ========================
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message
  })
})

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`MediSync server running on port ${PORT}`)
})

module.exports = app