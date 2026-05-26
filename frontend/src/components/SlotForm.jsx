import { useState } from 'react'
import { createSlot } from '../services/slotService'
import { useAuth } from '../context/useAuth'

function SlotForm({ refreshSlots }) {
  const { user } = useAuth()

  const [form, setForm] = useState({
    doctor_id: user?.role === 'doctor' ? user.id : '',
    specialization_id: '',
    slot_date: '',
    start_time: '',
    end_time: '',
    consultation_fee: '',
    max_patients: ''
  })

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsError(false)

    if (!form.doctor_id) {
      setMessage('Doctor ID is required')
      setIsError(true)
      return
    }

    try {
      setLoading(true)
      const payload = {
        doctor_id: Number(form.doctor_id),
        specialization_id: form.specialization_id ? Number(form.specialization_id) : null,
        slot_date: form.slot_date,
        start_time: form.start_time,
        end_time: form.end_time,
        consultation_fee: form.consultation_fee ? Number(form.consultation_fee) : 0,
        max_patients: form.max_patients ? Number(form.max_patients) : 1
      }

      await createSlot(payload)
      setMessage('Slot created successfully!')
      setIsError(false)

      setForm({
        doctor_id: user?.role === 'doctor' ? user.id : '',
        specialization_id: '',
        slot_date: '',
        start_time: '',
        end_time: '',
        consultation_fee: '',
        max_patients: ''
      })

      if (refreshSlots) refreshSlots()
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to create slot')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="slot-form">
      <h2>Create Doctor Slot</h2>

      {message && (
        <p style={{ color: isError ? 'red' : 'green', marginBottom: '12px' }}>{message}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Only show doctor_id field for admin/receptionist */}
        {user?.role !== 'doctor' && (
          <input
            type="number"
            name="doctor_id"
            placeholder="Doctor ID *"
            value={form.doctor_id}
            onChange={handleChange}
            required
          />
        )}

        {user?.role === 'doctor' && (
          <input
            type="text"
            value={`Dr. ${user.name} (ID: ${user.id})`}
            readOnly
            style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
          />
        )}

        <input
          type="number"
          name="specialization_id"
          placeholder="Specialization ID (1=Cardiology, 2=Dermatology, 3=Neurology, 4=Orthopedics, 5=Pediatrics)"
          value={form.specialization_id}
          onChange={handleChange}
        />

        <input
          type="date"
          name="slot_date"
          value={form.slot_date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        <input
          type="time"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="consultation_fee"
          placeholder="Consultation Fee (₹)"
          value={form.consultation_fee}
          onChange={handleChange}
          min="0"
        />

        <input
          type="number"
          name="max_patients"
          placeholder="Max Patients (default: 1)"
          value={form.max_patients}
          onChange={handleChange}
          min="1"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create Slot'}
        </button>
      </form>
    </div>
  )
}

export default SlotForm