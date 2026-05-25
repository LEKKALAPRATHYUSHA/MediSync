import { useNavigate } from 'react-router-dom'

function Navbar() {

  const navigate = useNavigate()

  // ==========================
  // LOGOUT
  // ==========================
  const handleLogout = () => {

    localStorage.removeItem('user')

    navigate('/login')
  }

  return (

    <div className="navbar">

      <h2>
        Healthcare Management System
      </h2>

      <button
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  )
}

export default Navbar