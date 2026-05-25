const db = require('../database/db')

// =============================
// BOOK APPOINTMENT
// =============================
const bookAppointment = (req, res) => {
  const {
    patient_id,
    slot_id,
    patient_name,
    patient_email,
    patient_phone,
    patient_age,
    patient_gender,
    symptoms
  } = req.body

  if (!slot_id || !patient_name || !patient_email || !patient_phone || !patient_age || !patient_gender) {
    return res.status(400).json({ message: 'All required fields are required' })
  }

  const slotQuery = `SELECT * FROM doctor_slots WHERE id = ?`

  db.get(slotQuery, [slot_id], (err, slot) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: 'Database error' })
    }

    if (!slot) {
      return res.status(404).json({ message: 'Invalid slot selected. Please choose a valid slot.' })
    }

    if (slot.status === 'CANCELLED') {
      return res.status(400).json({ message: 'This slot has been cancelled' })
    }

    if (slot.booked_count >= slot.max_patients) {
      return res.status(400).json({ message: 'Slot is fully booked' })
    }

    // FIX: parse date/time correctly — schema now stores HH:MM format
    const currentDate = new Date()
    const [year, month, day] = slot.slot_date.split('-').map(Number)
    const timeParts = (slot.start_time || '00:00').split(':').map(Number)
    const slotDateTime = new Date(year, month - 1, day, timeParts[0] || 0, timeParts[1] || 0, 0)

    if (isNaN(slotDateTime.getTime())) {
      return res.status(400).json({ message: 'Invalid slot date or time format' })
    }

    if (slotDateTime < currentDate) {
      return res.status(400).json({ message: 'Cannot book an expired slot' })
    }

    // FIX: duplicate check uses patient_email + slot_id (matches schema UNIQUE constraint)
    const duplicateQuery = `
      SELECT * FROM appointments
      WHERE patient_email = ? AND slot_id = ?
    `

    db.get(duplicateQuery, [patient_email, slot_id], (err, existing) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ message: 'Database error' })
      }

      if (existing) {
        return res.status(400).json({ message: 'You have already booked this slot' })
      }

      const insertQuery = `
        INSERT INTO appointments (
          patient_id, slot_id, patient_name, patient_email,
          patient_phone, patient_age, patient_gender, symptoms,
          appointment_status, booked_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled', datetime('now'))
      `

      db.run(
        insertQuery,
        [
          patient_id || null,
          slot_id,
          patient_name,
          patient_email,
          patient_phone,
          patient_age,
          patient_gender,
          symptoms || ''
        ],
        function (err) {
          if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Failed to book appointment' })
          }

          const appointmentId = this.lastID

          // Update slot booked_count
          db.run(
            `UPDATE doctor_slots SET booked_count = booked_count + 1 WHERE id = ?`,
            [slot_id],
            (err) => {
              if (err) console.log('Slot count update error:', err)

              // Auto-mark slot as FULL if needed
              db.run(
                `UPDATE doctor_slots SET status = 'FULL' WHERE id = ? AND booked_count >= max_patients`,
                [slot_id]
              )

              // Log the booking
              db.run(
                `INSERT INTO appointment_logs (appointment_id, old_status, new_status) VALUES (?, NULL, 'Scheduled')`,
                [appointmentId]
              )

              return res.status(201).json({
                message: 'Appointment booked successfully',
                appointment_id: appointmentId
              })
            }
          )
        }
      )
    })
  })
}

// =============================
// GET ALL APPOINTMENTS
// =============================
const getAppointments = (req, res) => {
  const { appointment_status, patient_id, slot_id } = req.query

  let query = `SELECT * FROM appointments WHERE 1=1`
  let params = []

  if (appointment_status) {
    query += ` AND appointment_status = ?`
    params.push(appointment_status)
  }
  if (patient_id) {
    query += ` AND patient_id = ?`
    params.push(patient_id)
  }
  if (slot_id) {
    query += ` AND slot_id = ?`
    params.push(slot_id)
  }

  query += ` ORDER BY booked_at DESC`

  db.all(query, params, (err, appointments) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: 'Failed to fetch appointments' })
    }
    return res.json({ total: appointments.length, appointments })
  })
}

// =============================
// FILTER APPOINTMENTS
// =============================
const getFilteredAppointments = (req, res) => {
  const { doctorName, specialization, date, status } = req.query

  let query = `
    SELECT
      appointments.*,
      doctor_slots.slot_date,
      doctor_slots.start_time,
      doctor_slots.end_time,
      doctor_slots.consultation_fee,
      users.name AS doctor_name,
      specializations.name AS specialization_name
    FROM appointments
    JOIN doctor_slots ON appointments.slot_id = doctor_slots.id
    JOIN users ON doctor_slots.doctor_id = users.id
    LEFT JOIN specializations ON doctor_slots.specialization_id = specializations.id
    WHERE 1=1
  `
  let params = []

  if (doctorName) {
    query += ` AND users.name LIKE ?`
    params.push(`%${doctorName}%`)
  }
  if (specialization) {
    query += ` AND specializations.name = ?`
    params.push(specialization)
  }
  if (date) {
    query += ` AND doctor_slots.slot_date = ?`
    params.push(date)
  }
  if (status) {
    query += ` AND appointments.appointment_status = ?`
    params.push(status)
  }

  query += ` ORDER BY appointments.booked_at DESC`

  db.all(query, params, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: 'Failed to filter appointments' })
    }
    return res.json({ total: results.length, appointments: results })
  })
}

// =============================
// UPDATE STATUS
// =============================
const updateAppointmentStatus = (req, res) => {
  const { id } = req.params
  const { appointment_status } = req.body

  const validStatuses = ['Scheduled', 'Completed', 'Cancelled', 'Missed']

  if (!appointment_status) {
    return res.status(400).json({ message: 'Appointment status required' })
  }
  if (!validStatuses.includes(appointment_status)) {
    return res.status(400).json({ message: 'Invalid appointment status' })
  }

  const findQuery = `SELECT * FROM appointments WHERE id = ?`

  db.get(findQuery, [id], (err, appointment) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: 'Database error' })
    }
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    const oldStatus = appointment.appointment_status

    db.run(
      `UPDATE appointments SET appointment_status = ? WHERE id = ?`,
      [appointment_status, id],
      function (err) {
        if (err) {
          console.log(err)
          return res.status(500).json({ message: 'Failed to update appointment' })
        }

        // Log the status change
        db.run(
          `INSERT INTO appointment_logs (appointment_id, old_status, new_status) VALUES (?, ?, ?)`,
          [id, oldStatus, appointment_status]
        )

        return res.json({ message: 'Appointment status updated successfully' })
      }
    )
  })
}

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  getFilteredAppointments
}