const { generatePatientReport } = require('../utils/pdfGenerator')
const db = require('../database/db')

// =====================================
// CREATE PATIENT RECORD
// =====================================
const createPatientRecord = (req, res) => {
  const { appointment_id, diagnosis, prescription, consultation_notes } = req.body

  if (!appointment_id) {
    return res.status(400).json({ message: 'Appointment ID is required' })
  }

  const appointmentQuery = `SELECT * FROM appointments WHERE id = ?`

  db.get(appointmentQuery, [appointment_id], (err, appointment) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    // FIX: prevent duplicate records for the same appointment
    const existingQuery = `SELECT * FROM patient_records WHERE appointment_id = ?`
    db.get(existingQuery, [appointment_id], (err, existing) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }

      if (existing) {
        // Update instead of insert
        const updateQuery = `
          UPDATE patient_records
          SET diagnosis = ?, prescription = ?, consultation_notes = ?
          WHERE appointment_id = ?
        `
        db.run(updateQuery, [
          diagnosis || '',
          prescription || '',
          consultation_notes || '',
          appointment_id
        ], function (err) {
          if (err) {
            return res.status(500).json({ message: 'Failed to update patient record' })
          }
          return res.json({ message: 'Patient record updated successfully', record_id: existing.id })
        })
        return
      }

      const insertQuery = `
        INSERT INTO patient_records (appointment_id, diagnosis, prescription, consultation_notes)
        VALUES (?, ?, ?, ?)
      `
      db.run(insertQuery, [
        appointment_id,
        diagnosis || '',
        prescription || '',
        consultation_notes || ''
      ], function (err) {
        if (err) {
          return res.status(500).json({ message: 'Failed to create patient record' })
        }
        return res.status(201).json({ message: 'Patient record created successfully', record_id: this.lastID })
      })
    })
  })
}

// =====================================
// GET ALL PATIENT RECORDS
// =====================================
const getPatientRecords = (req, res) => {
  const { appointment_id } = req.query

  let query = `
    SELECT
      pr.*,
      a.patient_name,
      a.patient_email,
      a.appointment_status,
      ds.slot_date,
      ds.start_time,
      u.name AS doctor_name
    FROM patient_records pr
    JOIN appointments a ON pr.appointment_id = a.id
    JOIN doctor_slots ds ON a.slot_id = ds.id
    JOIN users u ON ds.doctor_id = u.id
    WHERE 1=1
  `
  let params = []

  if (appointment_id) {
    query += ` AND pr.appointment_id = ?`
    params.push(appointment_id)
  }

  query += ` ORDER BY pr.created_at DESC`

  db.all(query, params, (err, records) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: 'Failed to fetch patient records' })
    }
    return res.json({ total: records.length, records })
  })
}

// =====================================
// UPDATE PATIENT RECORD
// =====================================
const updatePatientRecord = (req, res) => {
  const { id } = req.params
  const { diagnosis, prescription, consultation_notes } = req.body

  const updateQuery = `
    UPDATE patient_records
    SET diagnosis = ?, prescription = ?, consultation_notes = ?
    WHERE id = ?
  `

  db.run(updateQuery, [
    diagnosis || '',
    prescription || '',
    consultation_notes || '',
    id
  ], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to update patient record' })
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Patient record not found' })
    }
    return res.json({ message: 'Patient record updated successfully' })
  })
}

// =====================================
// DOWNLOAD PDF REPORT
// =====================================
const downloadPatientReport = (req, res) => {
  const { id } = req.params

  const query = `
    SELECT
      pr.*,
      a.patient_name,
      a.patient_email,
      a.patient_age,
      a.patient_gender,
      a.symptoms,
      ds.slot_date,
      ds.start_time,
      u.name AS doctor_name
    FROM patient_records pr
    JOIN appointments a ON pr.appointment_id = a.id
    JOIN doctor_slots ds ON a.slot_id = ds.id
    JOIN users u ON ds.doctor_id = u.id
    WHERE pr.id = ?
  `

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to generate report' })
    }
    if (!row) {
      return res.status(404).json({ message: 'Patient record not found' })
    }
    generatePatientReport(res, row)
  })
}

// FIX: single module.exports with all four functions
module.exports = {
  createPatientRecord,
  getPatientRecords,
  updatePatientRecord,
  downloadPatientReport
}