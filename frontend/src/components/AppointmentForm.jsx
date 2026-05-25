import { useState, useEffect } from 'react'
import { bookAppointment } from '../services/appointmentService'
import axiosInstance from '../api/axiosInstance'

function AppointmentForm({ refreshAppointments }) {
  const [form, setForm] = useState({
    patient_id: '',
    slot_id: '',
    patient_name: '',
    patient_email: '',
    patient_phone: '',
    patient_age: '',
    patient_gender: '',
    symptoms: ''
  })

  const [availableSlots, setAvailableSlots] = useState([])
  const [slotsError, setSlotsError] = useState('')   // ← new: surface slot-load errors
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchSlots = async () => {
    try {
      setSlotsError('')
      const res = await axiosInstance.get('/doctor-slots/available')
      console.log('Slots response:', res.data)        // ← verify shape in console
      setAvailableSlots(res.data.slots || [])
    } catch (err) {
      console.error('Failed to load slots:', err)
      setSlotsError(
        err?.response?.data?.message ||
        `Slots failed to load (${err?.response?.status ?? 'network error'})`
      )
    }
  }

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchSlots()
}, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const payload = {
        ...form,
        patient_id: form.patient_id ? Number(form.patient_id) : null,
        slot_id: Number(form.slot_id),
        patient_age: Number(form.patient_age)
      }

      const res = await bookAppointment(payload)
      setSuccess(res.message || 'Appointment booked successfully')

      setForm({
        patient_id: '',
        slot_id: '',
        patient_name: '',
        patient_email: '',
        patient_phone: '',
        patient_age: '',
        patient_gender: '',
        symptoms: ''
      })

      await fetchSlots()           // refresh slots after booking
      refreshAppointments()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="appointment-form">
      <h2>Book Appointment</h2>

      {error   && <p style={{ color: 'red',   marginBottom: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}

      <form onSubmit={handleSubmit}>

        {/* Slot selector — shows error inline if load failed */}
        {slotsError ? (
          <p style={{ color: 'red', marginBottom: '8px' }}>
            ⚠ {slotsError} —{' '}
            <button type="button" onClick={fetchSlots}>Retry</button>
          </p>
        ) : (
          <select
            name="slot_id"
            value={form.slot_id}
            onChange={handleChange}
            required
          >
            <option value="">
              {availableSlots.length === 0 ? 'Loading slots…' : 'Select a slot'}
            </option>
            {availableSlots.map(slot => (
              <option key={slot.id} value={slot.id}>
                {slot.doctor_name} — {slot.slot_date} {slot.start_time}–{slot.end_time}
                {slot.specialization_name ? ` (${slot.specialization_name})` : ''}
                {' '}| ₹{slot.consultation_fee} | {slot.max_patients - slot.booked_count} spots left
              </option>
            ))}
          </select>
        )}

        <input
          name="patient_name"
          placeholder="Full Name"
          value={form.patient_name}
          onChange={handleChange}
          required
        />

        <input
          name="patient_email"
          type="email"
          placeholder="Email"
          value={form.patient_email}
          onChange={handleChange}
          required
        />

        <input
          name="patient_phone"
          placeholder="Phone Number"
          value={form.patient_phone}
          onChange={handleChange}
          required
        />

        <input
          name="patient_age"
          type="number"
          placeholder="Age"
          min="1"
          max="120"
          value={form.patient_age}
          onChange={handleChange}
          required
        />

        <select
          name="patient_gender"
          value={form.patient_gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          name="symptoms"
          placeholder="Describe your symptoms (optional)"
          value={form.symptoms}
          onChange={handleChange}
          rows={3}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  )
}

export default AppointmentForm