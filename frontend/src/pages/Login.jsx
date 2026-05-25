import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      login(response.data.user, response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>MediSync</h1>
        <p>Sign in to your account</p>

        {error && <p style={{ color: '#dc2626', marginBottom: '12px', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#64748b', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb' }}>Register</Link>
        </p>

        <div style={{ marginTop: '16px', padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '12px', color: '#64748b' }}>
          <strong>Demo credentials (password: password123)</strong><br />
          Admin: admin@test.com | Doctor: doctor@test.com<br />
          Patient: patient@test.com | Reception: reception@test.com
        </div>
      </div>
    </div>
  )
}

export default Login