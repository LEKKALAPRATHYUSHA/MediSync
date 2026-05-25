import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

import DoctorSlots
from './pages/DoctorSlots'

import BookAppointment
from './pages/BookAppointment'

import AppointmentHistory
from './pages/AppointmentHistory'

import PatientRecords
from './pages/PatientRecords'

import ConsultationManagement
from './pages/ConsultationManagement'

import AdminDashboard
from './pages/AdminDashboard'

import ProtectedRoute
from './components/ProtectedRoute'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ======================
            DEFAULT ROUTE
        ====================== */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* ======================
            PUBLIC ROUTES
        ====================== */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ======================
            PROTECTED ROUTES
        ====================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-slots"
          element={
            <ProtectedRoute>
              <DoctorSlots />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointment-history"
          element={
            <ProtectedRoute>
              <AppointmentHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient-records"
          element={
            <ProtectedRoute>
              <PatientRecords />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consultations"
          element={
            <ProtectedRoute>
              <ConsultationManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App