const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const errorHandler = require('./middleware/errorMiddleware')
require('./database/db')

const authRoutes = require('./routes/authRoutes')
const slotRoutes = require('./routes/slotRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const patientRecordRoutes = require('./routes/patientRecordRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/doctor-slots', slotRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/patient-records', patientRecordRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.get('/', (req, res) => {
  res.send('Healthcare API Running')
})

app.use(errorHandler)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})

