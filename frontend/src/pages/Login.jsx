import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { loginUser } from '../services/authService'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const data = await loginUser({ email, password })
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>MediSync</h1>
        <p>Sign in to your account</p>

        {error && (
          <p style={{ color: '#dc2626', marginBottom: '12px', textAlign: 'center', fontSize: '14px' }}>
            {error}
          </p>
        )}

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
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb' }}>Register</Link>
        </p>

        <div style={{
          marginTop: '20px', padding: '14px', background: '#f1f5f9',
          borderRadius: '8px', fontSize: '12px', color: '#475569', lineHeight: '1.7'
        }}>
          <strong>Demo credentials (password: password123)</strong><br />
          Admin: admin@test.com<br />
          Doctor: doctor@test.com<br />
          Patient: patient@test.com<br />
          Reception: reception@test.com
        </div>
      </div>
    </div>
  )
}

export default Login