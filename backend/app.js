require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Init database - no try/catch so errors are visible
require('./database/init')

// Routes
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

app.get('/', (req, res) => {
  res.json({ message: 'MediSync API is running' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal Server Error', error: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`MediSync server running on port ${PORT}`)
})

module.exports = app