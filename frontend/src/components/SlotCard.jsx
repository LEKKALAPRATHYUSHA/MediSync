function SlotCard({ slot }) {

  return (

    <div className="slot-card">

      <h3>
        Doctor ID: {slot.doctor_id}
      </h3>

      <p>
        Date: {slot.slot_date}
      </p>

      <p>
        Time:
        {' '}
        {slot.start_time}
        {' - '}
        {slot.end_time}
      </p>

      <p>
        Fee:
        ₹{slot.consultation_fee}
      </p>

      <p>
        Patients:
        {' '}
        {slot.booked_count}
        /
        {slot.max_patients}
      </p>

      <p>
        Status:
        {' '}
        {slot.status}
      </p>

    </div>
  )
}

export default SlotCard