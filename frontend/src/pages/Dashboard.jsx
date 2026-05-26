import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Loader, DashboardCard } from '../components/UI'
import { getDashboardSummary } from '../services/dashboardService'
import { downloadAppointmentSlip, downloadConsultationReport } from '../utils/pdfUtils'

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getDashboardSummary()
      .then((data) => { if (mounted) setSummary(data.dashboard) })
      .catch(console.error)
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  if (loading) return <Loader />

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="page-container">
          <div className="page-header">
            <h1>Healthcare Dashboard</h1>
            <p>Overview of your healthcare operations</p>
          </div>

          <div className="dashboard-grid">
            <DashboardCard title="Total Appointments" value={summary?.totalAppointments ?? 0} />
            <DashboardCard title="Completed Consultations" value={summary?.completedAppointments ?? 0} />
            <DashboardCard title="Cancelled" value={summary?.cancelledAppointments ?? 0} />
            <DashboardCard title="Total Doctors" value={summary?.totalDoctors ?? 0} />
            <DashboardCard title="Total Patients" value={summary?.totalPatients ?? 0} />
            <DashboardCard title="Revenue (₹)" value={summary?.totalRevenue ?? 0} />
          </div>

          {/* Sample Appointment Slip */}
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ marginBottom: '16px' }}>Sample Appointment Slip</h2>
            <div id="appointment-slip" style={{
              padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px',
              background: 'white', maxWidth: '500px'
            }}>
              <h3 style={{ color: '#2563eb', marginBottom: '12px' }}>MediSync Appointment Slip</h3>
              <p><strong>Patient:</strong> John Doe</p>
              <p><strong>Doctor:</strong> Dr. Sharma</p>
              <p><strong>Date:</strong> 15-Dec-2026</p>
              <p><strong>Time:</strong> 10:00 - 11:00</p>
              <p><strong>Status:</strong> Scheduled</p>
            </div>
            <button
              onClick={() => downloadAppointmentSlip('appointment-slip')}
              style={{ marginTop: '12px' }}
            >
              Download Appointment Slip
            </button>
          </div>

          {/* Sample Consultation Report */}
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ marginBottom: '16px' }}>Sample Consultation Report</h2>
            <div id="consultation-report" style={{
              padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px',
              background: 'white', maxWidth: '500px'
            }}>
              <h3 style={{ color: '#2563eb', marginBottom: '12px' }}>MediSync Consultation Report</h3>
              <p><strong>Patient:</strong> John Doe</p>
              <p><strong>Doctor:</strong> Dr. Sharma</p>
              <p><strong>Diagnosis:</strong> Viral Fever</p>
              <p><strong>Prescription:</strong> Paracetamol 500mg</p>
              <p><strong>Notes:</strong> Rest and drink fluids</p>
            </div>
            <button
              onClick={() => downloadConsultationReport('consultation-report')}
              style={{ marginTop: '12px' }}
            >
              Download Consultation Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard