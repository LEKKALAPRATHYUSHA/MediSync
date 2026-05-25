import {
  useEffect,
  useState
} from 'react'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Loader from '../components/Loader'

import PatientRecordForm
from '../components/PatientRecordForm'

import PatientRecordCard
from '../components/PatientRecordCard'

import {
  getPatientRecords
} from '../services/patientRecordService'

function PatientRecords() {

  const [records, setRecords] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  // ==========================
  // FETCH RECORDS
  // ==========================
  const fetchRecords = async () => {

    try {

      const data =
        await getPatientRecords()

      setRecords(
        data.records || []
      )

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    const loadRecords = async () => {

      await fetchRecords()
    }

    loadRecords()

  }, [])

  if (loading) {
    return <Loader />
  }

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div style={{ padding: '20px' }}>

          <h1>
            Patient Medical Records
          </h1>

          <PatientRecordForm
            refreshRecords={
              fetchRecords
            }
          />

          <div className="records-grid">

            {records.length > 0 ? (

              records.map((record) => (

                <PatientRecordCard
                  key={record.id}
                  record={record}
                />

              ))

            ) : (

              <p>
                No patient records found
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default PatientRecords