import { downloadPatientReport } from '../services/patientRecordService'

function PatientRecordCard({ record }) {
  const handleDownload = async () => {
    try {
      const blob = await downloadPatientReport(record.id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `patient-report-${record.id}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="record-card">
      <h3>Appointment #{record.appointment_id}</h3>
      {record.patient_name && <p><strong>Patient:</strong> {record.patient_name}</p>}
      {record.doctor_name && <p><strong>Doctor:</strong> {record.doctor_name}</p>}
      {record.slot_date && <p><strong>Date:</strong> {record.slot_date}</p>}
      <p><strong>Diagnosis:</strong> {record.diagnosis || 'Pending'}</p>
      <p><strong>Prescription:</strong> {record.prescription || 'None'}</p>
      <p><strong>Notes:</strong> {record.consultation_notes || 'None'}</p>
      <button onClick={handleDownload} style={{ marginTop: '12px' }}>
        Download PDF Report
      </button>
    </div>
  )
}

export default PatientRecordCard