const db = require('../database/db')

const getDashboardSummary = (req, res) => {
  const summary = {}

  db.get('SELECT COUNT(*) AS total FROM appointments', [], (err, r1) => {
    if (err) return res.status(500).json({ message: 'DB error (appointments)' })
    summary.totalAppointments = r1.total

    db.get("SELECT COUNT(*) AS total FROM appointments WHERE appointment_status = 'Completed'", [], (err2, r2) => {
      if (err2) return res.status(500).json({ message: 'DB error (completed)' })
      summary.completedAppointments = r2.total

      db.get("SELECT COUNT(*) AS total FROM appointments WHERE appointment_status = 'Cancelled'", [], (err3, r3) => {
        if (err3) return res.status(500).json({ message: 'DB error (cancelled)' })
        summary.cancelledAppointments = r3.total

        db.get("SELECT COUNT(*) AS total FROM users WHERE role = 'doctor'", [], (err4, r4) => {
          if (err4) return res.status(500).json({ message: 'DB error (doctors)' })
          summary.totalDoctors = r4.total

          db.get("SELECT COUNT(*) AS total FROM users WHERE role = 'patient'", [], (err5, r5) => {
            if (err5) return res.status(500).json({ message: 'DB error (patients)' })
            summary.totalPatients = r5.total

            db.get(
              `SELECT SUM(ds.consultation_fee) AS totalRevenue
               FROM appointments a
               JOIN doctor_slots ds ON a.slot_id = ds.id
               WHERE a.appointment_status = 'Completed'`,
              [],
              (err6, r6) => {
                if (err6) return res.status(500).json({ message: 'DB error (revenue)' })
                summary.totalRevenue = r6.totalRevenue || 0

                return res.json({
                  message: 'Dashboard summary fetched successfully',
                  dashboard: summary
                })
              }
            )
          })
        })
      })
    })
  })
}

module.exports = { getDashboardSummary }