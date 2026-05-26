import { useState, useEffect, useCallback } from 'react'
import { bookAppointment } from '../services/appointmentService'
import { getAvailableSlots } from '../services/slotService'
import { useAuth } from '../context/useAuth'

function AppointmentForm({ refreshAppointments }) {
  const { user } = useAuth()

  const [form, setForm] = useState({
    slot_id: '',
    patient_name: user?.name || '',
    patient_email: user?.email || '',
    patient_phone: user?.phone || '',
    patient_age: '',
    patient_gender: '',
    symptoms: ''
  })

  const [availableSlots, setAvailableSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(true)
  const [slotsError, setSlotsError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchSlots = useCallback(async () => {
    setSlotsLoading(true)
    setSlotsError('')
    try {
      const data = await getAvailableSlots()
      setAvailableSlots(data.slots || [])
    } catch (err) {
      setSlotsError(
        err?.response?.data?.message ||
        `Failed to load slots (${err?.response?.status ?? 'network error'})`
      )
    } finally {
      setSlotsLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setSlotsLoading(true)
      setSlotsError('')
      try {
        const data = await getAvailableSlots()
        if (!cancelled) setAvailableSlots(data.slots || [])
      } catch (err) {
        if (!cancelled)
          setSlotsError(
            err?.response?.data?.message ||
            `Failed to load slots (${err?.response?.status ?? 'network error'})`
          )
      } finally {
        if (!cancelled) setSlotsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.slot_id) {
      setError('Please select a slot')
      return
    }

    try {
      setLoading(true)
      const payload = {
        slot_id: Number(form.slot_id),
        patient_name: form.patient_name,
        patient_email: form.patient_email,
        patient_phone: form.patient_phone,
        patient_age: Number(form.patient_age),
        patient_gender: form.patient_gender,
        symptoms: form.symptoms,
        patient_id: user?.id || null
      }

      const res = await bookAppointment(payload)
      setSuccess(res.message || 'Appointment booked successfully!')

      setForm({
        slot_id: '',
        patient_name: user?.name || '',
        patient_email: user?.email || '',
        patient_phone: user?.phone || '',
        patient_age: '',
        patient_gender: '',
        symptoms: ''
      })

      await fetchSlots()
      if (refreshAppointments) refreshAppointments()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="appointment-form">
      <h2>Book Appointment</h2>

      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        {slotsError ? (
          <div style={{ marginBottom: '12px' }}>
            <p style={{ color: 'red' }}>⚠ {slotsError}</p>
            <button type="button" onClick={fetchSlots} style={{ marginTop: '6px' }}>
              Retry
            </button>
          </div>
        ) : (
          <select name="slot_id" value={form.slot_id} onChange={handleChange} required>
            <option value="">
              {slotsLoading ? 'Loading slots…' : availableSlots.length === 0 ? 'No available slots' : 'Select a slot'}
            </option>
            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.doctor_name} — {slot.slot_date} {slot.start_time}–{slot.end_time}
                {slot.specialization_name ? ` (${slot.specialization_name})` : ''}
                {' '}| ₹{slot.consultation_fee} | {slot.max_patients - slot.booked_count} spot(s) left
              </option>
            ))}
          </select>
        )}

        <input
          name="patient_name"
          placeholder="Full Name *"
          value={form.patient_name}
          onChange={handleChange}
          required
        />

        <input
          name="patient_email"
          type="email"
          placeholder="Email *"
          value={form.patient_email}
          onChange={handleChange}
          required
        />

        <input
          name="patient_phone"
          placeholder="Phone Number *"
          value={form.patient_phone}
          onChange={handleChange}
          required
        />

        <input
          name="patient_age"
          type="number"
          placeholder="Age *"
          min="1"
          max="120"
          value={form.patient_age}
          onChange={handleChange}
          required
        />

        <select name="patient_gender" value={form.patient_gender} onChange={handleChange} required>
          <option value="">Select Gender *</option>
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

        <button type="submit" disabled={loading || slotsLoading}>
          {loading ? 'Booking…' : 'Book Appointment'}
        </button>
      </form>
    </div>
  )
}

export default AppointmentForm