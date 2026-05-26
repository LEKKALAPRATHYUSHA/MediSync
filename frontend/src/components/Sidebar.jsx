import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import {
  LayoutDashboard, CalendarDays, ClipboardList,
  FileText, Stethoscope, ShieldCheck, LogOut
} from 'lucide-react'

function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = user?.role === 'admin'
  const isDoctor = user?.role === 'doctor'
  const isReceptionist = user?.role === 'receptionist'
  const canManageSlots = isAdmin || isDoctor || isReceptionist
  const canViewRecords = isAdmin || isDoctor

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">MediSync</h2>
        <p className="sidebar-role">{user?.role?.toUpperCase() || 'USER'}</p>
      </div>

      <nav className="sidebar-nav">
        <Link className="sidebar-link" to="/dashboard">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        {canManageSlots && (
          <Link className="sidebar-link" to="/doctor-slots">
            <CalendarDays size={18} />
            <span>Doctor Slots</span>
          </Link>
        )}

        <Link className="sidebar-link" to="/book-appointment">
          <ClipboardList size={18} />
          <span>Appointments</span>
        </Link>

        <Link className="sidebar-link" to="/appointment-history">
          <CalendarDays size={18} />
          <span>Appointment History</span>
        </Link>

        {canViewRecords && (
          <Link className="sidebar-link" to="/patient-records">
            <FileText size={18} />
            <span>Patient Records</span>
          </Link>
        )}

        {canViewRecords && (
          <Link className="sidebar-link" to="/consultations">
            <Stethoscope size={18} />
            <span>Consultations</span>
          </Link>
        )}

        {isAdmin && (
          <Link className="sidebar-link" to="/admin-dashboard">
            <ShieldCheck size={18} />
            <span>Admin Dashboard</span>
          </Link>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <p className="user-name">{user?.name || 'Guest'}</p>
          <p className="user-email">{user?.email || ''}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar