import {
  downloadPatientReport
} from '../services/patientRecordService'

function PatientRecordCard({
  record
}) {

  const handleDownload =
    async () => {

      try {

        const blob =
          await downloadPatientReport(
            record.id
          )

        const url =
          window.URL.createObjectURL(blob)

        const link =
          document.createElement('a')

        link.href = url

        link.download =
          `patient-report-${record.id}.pdf`

        document.body.appendChild(link)

        link.click()

        link.remove()

      } catch (error) {

        console.log(error)
      }
    }

  return (

    <div className="record-card">

      <h3>
        Appointment #{record.appointment_id}
      </h3>

      <p>
        Diagnosis:
        {' '}
        {record.diagnosis}
      </p>

      <p>
        Prescription:
        {' '}
        {record.prescription}
      </p>

      <p>
        Notes:
        {' '}
        {record.consultation_notes}
      </p>

      <button onClick={handleDownload}>
        Download PDF
      </button>

    </div>
  )
}

export default PatientRecordCard