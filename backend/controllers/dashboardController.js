const db = require('../database/db')

// ====================================
// DASHBOARD SUMMARY
// ====================================
const getDashboardSummary = (req, res) => {

  const dashboardData = {}

  // Total appointments
  const totalAppointmentsQuery = `
    SELECT COUNT(*) AS totalAppointments
    FROM appointments
  `

  db.get(totalAppointmentsQuery, [], (err, totalAppointmentsResult) => {

    if (err) {
      return res.status(500).json({
        message: 'Database error (appointments)'
      })
    }

    dashboardData.totalAppointments =
      totalAppointmentsResult.totalAppointments

    // Completed appointments
    const completedAppointmentsQuery = `
      SELECT COUNT(*) AS completedAppointments
      FROM appointments
      WHERE appointment_status = 'Completed'
    `

    db.get(
      completedAppointmentsQuery,
      [],
      (err, completedResult) => {

        if (err) {
          return res.status(500).json({
            message: 'Database error (completed)'
          })
        }

        dashboardData.completedAppointments =
          completedResult.completedAppointments

        // Cancelled appointments
        const cancelledAppointmentsQuery = `
          SELECT COUNT(*) AS cancelledAppointments
          FROM appointments
          WHERE appointment_status = 'Cancelled'
        `

        db.get(
          cancelledAppointmentsQuery,
          [],
          (err, cancelledResult) => {

            if (err) {
              return res.status(500).json({
                message: 'Database error (cancelled)'
              })
            }

            dashboardData.cancelledAppointments =
              cancelledResult.cancelledAppointments

            // Total doctors
            const totalDoctorsQuery = `
              SELECT COUNT(*) AS totalDoctors
              FROM users
              WHERE role = 'doctor'
            `

            db.get(
              totalDoctorsQuery,
              [],
              (err, doctorResult) => {

                if (err) {
                  return res.status(500).json({
                    message: 'Database error (doctors)'
                  })
                }

                dashboardData.totalDoctors =
                  doctorResult.totalDoctors

                // Total patients
                const totalPatientsQuery = `
                  SELECT COUNT(*) AS totalPatients
                  FROM users
                  WHERE role = 'patient'
                `

                db.get(
                  totalPatientsQuery,
                  [],
                  (err, patientResult) => {

                    if (err) {
                      return res.status(500).json({
                        message: 'Database error (patients)'
                      })
                    }

                    dashboardData.totalPatients =
                      patientResult.totalPatients

                    // Revenue summary
                    const revenueQuery = `
                      SELECT 
                        SUM(doctor_slots.consultation_fee) AS totalRevenue
                      FROM appointments
                      INNER JOIN doctor_slots
                      ON appointments.slot_id = doctor_slots.id
                      WHERE appointments.appointment_status = 'Completed'
                    `

                    db.get(
                      revenueQuery,
                      [],
                      (err, revenueResult) => {

                        if (err) {
                          return res.status(500).json({
                            message: 'Database error (revenue)'
                          })
                        }

                        dashboardData.totalRevenue =
                          revenueResult.totalRevenue || 0

                        return res.json({
                          message: 'Dashboard summary fetched successfully',
                          dashboard: dashboardData
                        })
                      }
                    )
                  }
                )
              }
            )
          }
        )
      }
    )
  })
}

module.exports = {
  getDashboardSummary
}