function SlotCard({ slot }) {
  const statusColor = slot.status === 'AVAILABLE' ? '#16a34a' : slot.status === 'FULL' ? '#dc2626' : '#f59e0b'

  return (
    <div className="slot-card">
      <h3>{slot.doctor_name || `Doctor #${slot.doctor_id}`}</h3>
      {slot.specialization_name && <p><strong>Specialization:</strong> {slot.specialization_name}</p>}
      <p><strong>Date:</strong> {slot.slot_date}</p>
      <p><strong>Time:</strong> {slot.start_time} – {slot.end_time}</p>
      <p><strong>Fee:</strong> ₹{slot.consultation_fee}</p>
      <p><strong>Patients:</strong> {slot.booked_count}/{slot.max_patients}</p>
      <span style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '999px',
        background: statusColor,
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        marginTop: '8px'
      }}>
        {slot.status}
      </span>
    </div>
  )
}

export default SlotCard