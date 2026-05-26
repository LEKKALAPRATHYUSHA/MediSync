import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="navbar">
      <h2>Healthcare Management System</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Navbar