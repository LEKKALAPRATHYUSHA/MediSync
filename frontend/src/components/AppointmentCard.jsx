import { useState } from 'react'
import StatusBadge from './StatusBadge'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/useAuth'

function AppointmentCard({ appointment, onStatusUpdate }) {
  const { user } = useAuth()
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  const canUpdateStatus = user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'receptionist'

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true)
      setError('')
      await axiosInstance.put(`/appointments/${appointment.id}/status`, {
        appointment_status: newStatus
      })
      if (onStatusUpdate) onStatusUpdate()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="appointment-card">
      <h3>Appointment #{appointment.id}</h3>
      <p><strong>Patient:</strong> {appointment.patient_name}</p>
      <p><strong>Email:</strong> {appointment.patient_email}</p>
      <p><strong>Phone:</strong> {appointment.patient_phone}</p>
      <p><strong>Age:</strong> {appointment.patient_age} | <strong>Gender:</strong> {appointment.patient_gender}</p>
      {appointment.symptoms && <p><strong>Symptoms:</strong> {appointment.symptoms}</p>}
      {appointment.slot_date && (
        <p><strong>Date:</strong> {appointment.slot_date} {appointment.start_time && `at ${appointment.start_time}`}</p>
      )}
      {appointment.doctor_name && <p><strong>Doctor:</strong> {appointment.doctor_name}</p>}

      <StatusBadge status={appointment.appointment_status} />

      {canUpdateStatus && (
        <div style={{ marginTop: '12px' }}>
          <select
            defaultValue=""
            onChange={(e) => e.target.value && handleStatusChange(e.target.value)}
            disabled={updating}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', marginRight: '8px' }}
          >
            <option value="">Update status…</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Missed">Missed</option>
          </select>
          {updating && <span style={{ fontSize: '12px', color: '#64748b' }}>Saving…</span>}
          {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}

export default AppointmentCard