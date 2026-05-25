import AnalyticsCard
from './AnalyticsCard'

function DashboardStats({
  summary
}) {

  return (

    <div className="analytics-grid">

      <AnalyticsCard
        title="Total Appointments"
        value={
          summary?.totalAppointments || 0
        }
      />

      <AnalyticsCard
        title="Completed Consultations"
        value={
          summary?.completedAppointments || 0
        }
      />

      <AnalyticsCard
        title="Doctors"
        value={
          summary?.totalDoctors || 0
        }
      />

      <AnalyticsCard
        title="Patients"
        value={
          summary?.totalPatients || 0
        }
      />

    </div>
  )
}

export default DashboardStats