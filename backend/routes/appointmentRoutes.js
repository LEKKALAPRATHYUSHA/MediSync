const express = require('express')
const router = express.Router()
const db = require('../database/db')
const {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  getFilteredAppointments
} = require('../controllers/appointmentController')

router.post('/', bookAppointment)
router.get('/', getAppointments)
router.get('/filter', getFilteredAppointments)
router.put('/:id/status', updateAppointmentStatus)

// Appointment report (single appointment with slot info)
router.get('/report/:id', (req, res) => {
  const { id } = req.params
  const query = `
    SELECT
      a.*,
      ds.slot_date, ds.start_time, ds.end_time, ds.consultation_fee,
      u.name AS doctor_name,
      s.name AS specialization_name
    FROM appointments a
    JOIN doctor_slots ds ON a.slot_id = ds.id
    JOIN users u ON ds.doctor_id = u.id
    LEFT JOIN specializations s ON ds.specialization_id = s.id
    WHERE a.id = ?
  `
  db.get(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error generating report' })
    if (!result) return res.status(404).json({ message: 'Appointment not found' })
    return res.json({ report: result })
  })
})

module.exports = router