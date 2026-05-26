// StatusBadge
export function StatusBadge({ status }) {
  return <span className={`status-badge ${status}`}>{status}</span>
}

// Loader
export function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <h2>Loading...</h2>
    </div>
  )
}

// DashboardCard
export function DashboardCard({ title, value }) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  )
}

// AnalyticsCard
export function AnalyticsCard({ title, value }) {
  return (
    <div className="analytics-card">
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  )
}

// SearchBar
export function SearchBar({ search, setSearch, placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder || 'Search...'}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-bar"
    />
  )
}

// FilterBar
export function FilterBar({ filter, setFilter }) {
  return (
    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
      <option value="">All Statuses</option>
      <option value="Scheduled">Scheduled</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
      <option value="Missed">Missed</option>
    </select>
  )
}

// Pagination
export function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Prev
      </button>
      <span className="page-info">Page {currentPage} of {Math.max(totalPages, 1)}</span>
      <button
        className="pagination-btn"
        disabled={currentPage >= totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  )
}

// DashboardStats
export function DashboardStats({ summary }) {
  return (
    <div className="analytics-grid">
      <AnalyticsCard title="Total Appointments" value={summary?.totalAppointments || 0} />
      <AnalyticsCard title="Completed" value={summary?.completedAppointments || 0} />
      <AnalyticsCard title="Cancelled" value={summary?.cancelledAppointments || 0} />
      <AnalyticsCard title="Doctors" value={summary?.totalDoctors || 0} />
      <AnalyticsCard title="Patients" value={summary?.totalPatients || 0} />
      <AnalyticsCard title="Revenue (₹)" value={summary?.totalRevenue || 0} />
    </div>
  )
}