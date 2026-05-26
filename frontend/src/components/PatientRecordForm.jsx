import { useState } from 'react'
import { createPatientRecord } from '../services/patientRecordService'

function PatientRecordForm({ refreshRecords }) {
  const [form, setForm] = useState({
    appointment_id: '',
    diagnosis: '',
    prescription: '',
    consultation_notes: ''
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
    try {
      setLoading(true)
      await createPatientRecord({
        appointment_id: Number(form.appointment_id),
        diagnosis: form.diagnosis,
        prescription: form.prescription,
        consultation_notes: form.consultation_notes
      })
      setMessage('Patient record saved successfully!')
      setIsError(false)
      setForm({ appointment_id: '', diagnosis: '', prescription: '', consultation_notes: '' })
      if (refreshRecords) refreshRecords()
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to save record')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="record-form">
      <h2>Add / Update Consultation Record</h2>

      {message && (
        <p style={{ color: isError ? 'red' : 'green', marginBottom: '12px' }}>{message}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="appointment_id"
          placeholder="Appointment ID *"
          value={form.appointment_id}
          onChange={handleChange}
          required
        />
        <textarea
          name="diagnosis"
          placeholder="Diagnosis"
          value={form.diagnosis}
          onChange={handleChange}
          rows={2}
        />
        <textarea
          name="prescription"
          placeholder="Prescription"
          value={form.prescription}
          onChange={handleChange}
          rows={2}
        />
        <textarea
          name="consultation_notes"
          placeholder="Consultation Notes"
          value={form.consultation_notes}
          onChange={handleChange}
          rows={3}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save Record'}
        </button>
      </form>
    </div>
  )
}

export default PatientRecordForm