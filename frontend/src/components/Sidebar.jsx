import { Link } from 'react-router-dom'

import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  FileText,
  Stethoscope,
  ShieldCheck,
  LogOut
} from 'lucide-react'

import { useAuth }
from '../context/useAuth'

function Sidebar() {

  // ==========================
  // AUTH CONTEXT
  // ==========================
  const {
    user,
    logout
  } = useAuth()

  // ==========================
  // HANDLE LOGOUT
  // ==========================
  const handleLogout = () => {

    logout()
  }

  return (

    <div className="sidebar">

      {/* ====================== */}
      {/* LOGO */}
      {/* ====================== */}
      <div className="sidebar-header">

        <h2 className="logo">
          MediSync
        </h2>

        <p className="sidebar-role">

          {user?.role
            ? user.role.toUpperCase()
            : 'USER'}

        </p>

      </div>

      {/* ====================== */}
      {/* NAVIGATION */}
      {/* ====================== */}
      <nav className="sidebar-nav">

        {/* DASHBOARD */}
        <Link
          className="sidebar-link"
          to="/dashboard"
        >

          <LayoutDashboard size={18} />

          <span>
            Dashboard
          </span>

        </Link>

        {/* DOCTOR SLOTS */}
        {(user?.role === 'doctor' ||
          user?.role === 'admin') && (

          <Link
            className="sidebar-link"
            to="/doctor-slots"
          >

            <CalendarDays size={18} />

            <span>
              Doctor Slots
            </span>

          </Link>
        )}

        {/* APPOINTMENTS */}
        {(user?.role === 'patient' ||
          user?.role === 'receptionist' ||
          user?.role === 'doctor' ||
          user?.role === 'admin') && (

          <Link
            className="sidebar-link"
            to="/book-appointment"
          >

            <ClipboardList size={18} />

            <span>
              Appointments
            </span>

          </Link>
        )}

        {/* PATIENT RECORDS */}
        {(user?.role === 'doctor' ||
          user?.role === 'admin') && (

          <Link
            className="sidebar-link"
            to="/patient-records"
          >

            <FileText size={18} />

            <span>
              Patient Records
            </span>

          </Link>
        )}

        {/* CONSULTATIONS */}
        {(user?.role === 'doctor' ||
          user?.role === 'admin') && (

          <Link
            className="sidebar-link"
            to="/consultations"
          >

            <Stethoscope size={18} />

            <span>
              Consultations
            </span>

          </Link>
        )}

        {/* ADMIN DASHBOARD */}
        {user?.role === 'admin' && (

          <Link
            className="sidebar-link"
            to="/admin-dashboard"
          >

            <ShieldCheck size={18} />

            <span>
              Admin Dashboard
            </span>

          </Link>
        )}

      </nav>

      {/* ====================== */}
      {/* USER INFO */}
      {/* ====================== */}
      <div className="sidebar-footer">

        <div className="user-info">

          <p className="user-name">
            {user?.name || 'Guest'}
          </p>

          <p className="user-email">
            {user?.email || ''}
          </p>

        </div>

        {/* LOGOUT BUTTON */}
        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </div>
  )
}

export default Sidebar