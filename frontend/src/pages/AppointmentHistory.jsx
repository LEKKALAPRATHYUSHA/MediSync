import { useEffect, useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Loader from '../components/Loader'
import AppointmentCard from '../components/AppointmentCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'
import { getAppointments, getFilteredAppointments } from '../services/appointmentService'

function AppointmentHistory() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      const filters = {}
      if (filter) filters.status = filter
      const data = Object.keys(filters).length
        ? await getFilteredAppointments(filters)
        : await getAppointments()
      setAppointments(data.appointments || [])
      setCurrentPage(1)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [filter])  // re-creates only when filter changes

   useEffect(() => {
  (async () => {
    await fetchAppointments()
  })()
 }, [fetchAppointments])

  const filtered = appointments.filter(a =>
    !search ||
    a.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.symptoms?.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor_name?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) return <Loader />

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="page-container">
          <div className="page-header">
            <h1>Appointment History</h1>
            <p>View and manage all appointments</p>
          </div>
          <div className="filters-container">
            <SearchBar search={search} setSearch={setSearch} placeholder="Search by name, symptoms…" />
            <FilterBar filter={filter} setFilter={setFilter} />
          </div>
          {paginated.length > 0 ? (
            <div className="appointments-grid">
              {paginated.map(a => (
                <AppointmentCard key={a.id} appointment={a} onStatusUpdate={fetchAppointments} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No appointments found</h3>
              <p>Try adjusting your search or filter.</p>
            </div>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}

export default AppointmentHistory