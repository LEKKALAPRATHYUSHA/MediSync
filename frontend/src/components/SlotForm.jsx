import { useState } from 'react'

import {
  createSlot
} from '../services/slotService'

function SlotForm({ refreshSlots }) {

  const [formData, setFormData] =
    useState({
      doctor_id: '',
      specialization_id: '',
      slot_date: '',
      start_time: '',
      end_time: '',
      consultation_fee: '',
      max_patients: ''
    })

  const [message, setMessage] =
    useState('')

  // ==========================
  // HANDLE INPUT
  // ==========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    })
  }

  // ==========================
  // SUBMIT SLOT
  // ==========================
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await createSlot(formData)

      setMessage(
        'Slot created successfully'
      )

      refreshSlots()

      setFormData({
        doctor_id: '',
        specialization_id: '',
        slot_date: '',
        start_time: '',
        end_time: '',
        consultation_fee: '',
        max_patients: ''
      })

    } catch (error) {

      setMessage(
        error.response?.data?.message
        || 'Failed to create slot'
      )
    }
  }

  return (

    <div className="slot-form">

      <h2>Create Doctor Slot</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="number"
          name="doctor_id"
          placeholder="Doctor ID"
          value={formData.doctor_id}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="specialization_id"
          placeholder="Specialization ID"
          value={formData.specialization_id}
          onChange={handleChange}
        />

        <input
          type="date"
          name="slot_date"
          value={formData.slot_date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="consultation_fee"
          placeholder="Consultation Fee"
          value={formData.consultation_fee}
          onChange={handleChange}
        />

        <input
          type="number"
          name="max_patients"
          placeholder="Max Patients"
          value={formData.max_patients}
          onChange={handleChange}
        />

        <button type="submit">
          Create Slot
        </button>

      </form>

    </div>
  )
}

export default SlotForm