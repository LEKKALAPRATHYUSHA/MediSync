import {
  useEffect,
  useState
} from 'react'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Loader from '../components/Loader'

import AppointmentForm
from '../components/AppointmentForm'

import AppointmentCard
from '../components/AppointmentCard'

import {
  getAppointments
} from '../services/appointmentService'

function BookAppointment() {

  const [appointments, setAppointments] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  // ==========================
  // FETCH APPOINTMENTS
  // ==========================
  const fetchAppointments =
    async () => {

      try {

        const data =
          await getAppointments()

        setAppointments(
          data.appointments || []
        )

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)
      }
    }

  useEffect(() => {

    const loadAppointments =
      async () => {

        await fetchAppointments()
      }

    loadAppointments()

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
            Appointment Booking
          </h1>

          <AppointmentForm
            refreshAppointments={
              fetchAppointments
            }
          />

          <div className="appointments-grid">

            {appointments.length > 0 ? (

              appointments.map(
                (appointment) => (

                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />

              ))

            ) : (

              <p>
                No appointments found
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default BookAppointment