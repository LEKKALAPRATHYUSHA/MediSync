const db = require('../database/db')

// =========================
// CREATE DOCTOR SLOT
// =========================
const createSlot = (req, res) => {
  const {
    doctor_id,
    specialization_id,
    slot_date,
    start_time,
    end_time,
    consultation_fee,
    max_patients
  } = req.body

  if (!doctor_id || !slot_date || !start_time || !end_time) {
    return res.status(400).json({ message: 'Required fields missing' })
  }

  if (start_time >= end_time) {
    return res.status(400).json({ message: 'End time must be after start time' })
  }

  // FIX: robust expired check using explicit date construction
  const [year, month, day] = slot_date.split('-').map(Number)
  const [hours, minutes] = start_time.split(':').map(Number)
  const slotDateTime = new Date(year, month - 1, day, hours || 0, minutes || 0, 0)

  if (isNaN(slotDateTime.getTime())) {
    return res.status(400).json({ message: 'Invalid date or time format. Use YYYY-MM-DD and HH:MM' })
  }

  if (slotDateTime < new Date()) {
    return res.status(400).json({ message: 'Cannot create a slot in the past' })
  }

  const duplicateQuery = `
    SELECT * FROM doctor_slots
    WHERE doctor_id = ? AND slot_date = ? AND start_time = ? AND end_time = ?
  `

  db.get(duplicateQuery, [doctor_id, slot_date, start_time, end_time], (err, existingSlot) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }
    if (existingSlot) {
      return res.status(400).json({ message: 'A slot already exists for this time' })
    }

    const insertQuery = `
      INSERT INTO doctor_slots (
        doctor_id, specialization_id, slot_date, start_time, end_time,
        consultation_fee, max_patients, booked_count, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'AVAILABLE')
    `

    db.run(insertQuery, [
      doctor_id,
      specialization_id || null,
      slot_date,
      start_time,
      end_time,
      consultation_fee || 0,
      max_patients || 1
    ], function (err) {
      if (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to create slot' })
      }
      return res.status(201).json({ message: 'Slot created successfully', slot_id: this.lastID })
    })
  })
}

// =========================
// GET ALL SLOTS (with doctor name)
// =========================
const getSlots = (req, res) => {
  const { doctor_id, specialization_id, slot_date, slot_status, page = 1, limit = 10 } = req.query
  const offset = (page - 1) * limit

  let query = `
    SELECT ds.*, u.name AS doctor_name, s.name AS specialization_name
    FROM doctor_slots ds
    JOIN users u ON ds.doctor_id = u.id
    LEFT JOIN specializations s ON ds.specialization_id = s.id
    WHERE 1=1
  `
  let params = []

  if (doctor_id) { query += ` AND ds.doctor_id = ?`; params.push(doctor_id) }
  if (specialization_id) { query += ` AND ds.specialization_id = ?`; params.push(specialization_id) }
  if (slot_date) { query += ` AND ds.slot_date = ?`; params.push(slot_date) }
  if (slot_status) { query += ` AND ds.status = ?`; params.push(slot_status) }

  query += ` ORDER BY ds.slot_date ASC, ds.start_time ASC LIMIT ? OFFSET ?`
  params.push(Number(limit), Number(offset))

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch slots' })
    }
    const updatedRows = rows.map(slot => ({
      ...slot,
      status: slot.booked_count >= slot.max_patients ? 'FULL' : slot.status
    }))
    return res.json({ page: Number(page), limit: Number(limit), total: updatedRows.length, slots: updatedRows })
  })
}

// =========================
// GET AVAILABLE SLOTS (for booking UI)
// =========================
const getAvailableSlots = (req, res) => {
  const query = `
    SELECT ds.*, u.name AS doctor_name, s.name AS specialization_name
    FROM doctor_slots ds
    JOIN users u ON ds.doctor_id = u.id
    LEFT JOIN specializations s ON ds.specialization_id = s.id
    WHERE date(ds.slot_date) >= date('now')
      AND ds.booked_count < ds.max_patients
      AND ds.status = 'AVAILABLE'
    ORDER BY ds.slot_date ASC, ds.start_time ASC
  `

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch available slots' })
    }
    return res.json({ slots: rows })
  })
}

module.exports = { createSlot, getSlots, getAvailableSlots }