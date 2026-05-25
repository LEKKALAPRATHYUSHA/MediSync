import {
  useEffect,
  useState
} from 'react'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Loader from '../components/Loader'

import DashboardStats
from '../components/DashboardStats'

import {
  getDashboardSummary
} from '../services/dashboardService'

function AdminDashboard() {

  const [summary, setSummary] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  // ==========================
  // FETCH DASHBOARD DATA
  // ==========================
  const fetchSummary = async () => {

    try {

      const data =
        await getDashboardSummary()

      setSummary(data.dashboard)
      console.log("Dashboard API response:", data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    const loadSummary = async () => {

      await fetchSummary()
    }

    loadSummary()

  }, [])

  if (loading) {
    return <Loader />
  }

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div style={{ padding: '20px' }}>

          <h1>
            Admin Dashboard
          </h1>

          <DashboardStats
            summary={summary}
          />

        </div>

      </div>

    </div>
  )
}

export default AdminDashboard