import {
  useEffect,
  useState
} from 'react'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Loader from '../components/Loader'

import SlotForm from '../components/SlotForm'
import SlotCard from '../components/SlotCard'
import SearchBar from '../components/SearchBar'

import Pagination from '../components/Pagination'

import {
  getSlots
} from '../services/slotService'

function DoctorSlots() {

  const [slots, setSlots] =
    useState([])

  const [loading, setLoading] =
    useState(true)

    const [search, setSearch] =
  useState('')

    const [currentPage, setCurrentPage] =
  useState(1)

    const itemsPerPage = 4

  // ==========================
  // FETCH SLOTS
  // ==========================
  const fetchSlots = async () => {

    try {

      const data =
        await getSlots()

      setSlots(data.slots || [])

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    const loadSlots = async () => {

      await fetchSlots()
    }

    loadSlots()

  }, [])

  // ==========================
// FILTERED SLOTS
// ==========================
const filteredSlots =
  slots.filter((slot) =>

    slot.slot_date
      .includes(search)
  )

// ==========================
// PAGINATION
// ==========================
const totalPages = Math.ceil(
  filteredSlots.length /
  itemsPerPage
)

const startIndex =
  (currentPage - 1) *
  itemsPerPage

const paginatedSlots =
  filteredSlots.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return <Loader />
  }

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div style={{ padding: '20px' }}>

          <h1>Doctor Slots</h1>
          <SearchBar
            search={search}
            setSearch={setSearch}
            placeholder="Search by date..."
            />

          <SlotForm
            refreshSlots={fetchSlots}
          />

          <div className="slots-grid">

            {paginatedSlots.length > 0 ? (

            paginatedSlots.map((slot) => (

                <SlotCard
                  key={slot.id}
                  slot={slot}
                />

              ))

            ) : (

              <p>No slots available</p>

            )}

          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            />

        </div>

      </div>

    </div>
  )
}

export default DoctorSlots