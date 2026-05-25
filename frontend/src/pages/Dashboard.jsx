import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import DashboardCard from '../components/DashboardCard'
import Loader from '../components/Loader'

import { getDashboardSummary } from '../services/dashboardService'

import {
  downloadAppointmentSlip,
  downloadConsultationReport
} from '../utils/pdfUtils'

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  // ==========================
  // FETCH DASHBOARD DATA
  // ==========================
  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      try {
        const data = await getDashboardSummary()

        if (isMounted) {
          setSummary(data.dashboard)
        }
      } catch (error) {
        console.log(error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return <Loader />
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <h1>Healthcare Dashboard</h1>

        {/* ================= DASHBOARD STATS ================= */}
        <div className="dashboard-grid">

          <DashboardCard
            title="Total Appointments"
            value={summary?.totalAppointments || 0}
          />

          <DashboardCard
            title="Completed Consultations"
            value={summary?.completedAppointments || 0}
          />

          <DashboardCard
            title="Doctors"
            value={summary?.totalDoctors || 0}
          />

          <DashboardCard
            title="Patients"
            value={summary?.totalPatients || 0}
          />

        </div>

        {/* ================= APPOINTMENT SLIP ================= */}
        <div style={{ marginTop: '40px' }}>
          <div
            id="appointment-slip"
            style={{ padding: '20px', border: '1px solid #ccc' }}
          >
            <h2>Appointment Slip</h2>

            <p><strong>Patient:</strong> John Doe</p>
            <p><strong>Doctor:</strong> Dr. Smith</p>
            <p><strong>Status:</strong> Completed</p>
            <p><strong>Date:</strong> 25-05-2026</p>
          </div>

          <button
            onClick={() => downloadAppointmentSlip('appointment-slip')}
            style={{ marginTop: '10px' }}
          >
            Download Slip
          </button>
        </div>

        {/* ================= CONSULTATION REPORT ================= */}
        <div style={{ marginTop: '40px' }}>
          <div
            id="consultation-report"
            style={{ padding: '20px', border: '1px solid #ccc' }}
          >
            <h2>Consultation Report</h2>

            <p><strong>Patient Name:</strong> John Doe</p>
            <p><strong>Doctor:</strong> Dr. Smith</p>
            <p><strong>Diagnosis:</strong> Fever & Viral Infection</p>
            <p><strong>Prescription:</strong> Paracetamol 500mg</p>
            <p><strong>Notes:</strong> Rest and hydration</p>
            <p><strong>Status:</strong> Completed</p>
          </div>

          <button
            onClick={() =>
              downloadConsultationReport('consultation-report')
            }
            style={{ marginTop: '10px' }}
          >
            Download Report
          </button>
        </div>

      </div>
    </div>
  )
}

export default Dashboard