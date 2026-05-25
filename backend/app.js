const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const errorHandler =
  require('./middleware/errorMiddleware')

require('./database/db')

const authRoutes =
  require('./routes/authRoutes')

const slotRoutes =
  require('./routes/slotRoutes')

const appointmentRoutes =
  require('./routes/appointmentRoutes')

const patientRecordRoutes =
  require('./routes/patientRecordRoutes')

const dashboardRoutes =
  require('./routes/dashboardRoutes')

const app = express()

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors())

app.use(express.json())

// ==========================
// ROUTES
// ==========================
app.use('/api/auth', authRoutes)

app.use('/api/doctor-slots', slotRoutes)

app.use('/api/appointments', appointmentRoutes)

app.use('/api/patient-records', patientRecordRoutes)

app.use('/api/dashboard', dashboardRoutes)

// ==========================
// TEST ROUTE
// ==========================
app.get('/', (req, res) => {
  res.send('MediSync API Running')
})

// ==========================
// ERROR HANDLER
// ==========================
app.use(errorHandler)

// ==========================
// EXPORT APP
// ==========================
module.exports = app