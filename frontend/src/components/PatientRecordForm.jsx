import { useState } from 'react'

import {
  createPatientRecord
} from '../services/patientRecordService'

function PatientRecordForm({
  refreshRecords
}) {

  const [formData, setFormData] =
    useState({
      appointment_id: '',
      diagnosis: '',
      prescription: '',
      consultation_notes: ''
    })

  const [message, setMessage] =
    useState('')

  // ==========================
  // HANDLE CHANGE
  // ==========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    })
  }

  // ==========================
  // SUBMIT
  // ==========================
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await createPatientRecord(
        formData
      )

      setMessage(
        'Patient record saved successfully'
      )

      refreshRecords()

      setFormData({
        appointment_id: '',
        diagnosis: '',
        prescription: '',
        consultation_notes: ''
      })

    } catch (error) {

      setMessage(
        error.response?.data?.message
        || 'Failed to save record'
      )
    }
  }

  return (

    <div className="record-form">

      <h2>
        Add Consultation Record
      </h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="number"
          name="appointment_id"
          placeholder="Appointment ID"
          value={formData.appointment_id}
          onChange={handleChange}
          required
        />

        <textarea
          name="diagnosis"
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
        />

        <textarea
          name="prescription"
          placeholder="Prescription"
          value={formData.prescription}
          onChange={handleChange}
        />

        <textarea
          name="consultation_notes"
          placeholder="Consultation Notes"
          value={formData.consultation_notes}
          onChange={handleChange}
        />

        <button type="submit">
          Save Record
        </button>

      </form>

    </div>
  )
}

export default PatientRecordForm