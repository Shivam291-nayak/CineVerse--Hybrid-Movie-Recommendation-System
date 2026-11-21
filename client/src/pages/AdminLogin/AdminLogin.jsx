import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'
import '../Login/Login.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { setAuthenticatedUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await api.post('/admin/login', {
        email: email.trim().toLowerCase(),
        password,
      })

      const { user, token } = response.data

      // Make sure the account is actually an admin
      if (user.role !== 'admin') {
        setError('Not authorized as admin')
        return
      }

      // Store authentication data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Update AuthContext
      setAuthenticatedUser(user)

      // Redirect to admin dashboard
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Admin login error:', err)

      setError(
        err.response?.data?.message ||
        'Admin login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-backdrop"></div>

      <Link to="/" className="auth-logo">
        <span>Cine</span>Galaxy
      </Link>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <h2>Admin Login</h2>

        <p className="auth-subtitle">
          Restricted access — administrators only.
        </p>

        {error && (
          <p className="auth-error">
            <i className="bi bi-exclamation-circle"></i>
            {' '}
            {error}
          </p>
        )}

        <div className="auth-field">
          <i className="bi bi-shield-lock"></i>

          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="auth-field">
          <i className="bi bi-lock"></i>

          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Admin Login'}

          {!loading && (
            <i className="bi bi-arrow-right"></i>
          )}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin