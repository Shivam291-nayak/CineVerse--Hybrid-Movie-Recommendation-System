
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email.trim(), password)
      const loggedInUser = result.user

      if (loggedInUser?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else if (loggedInUser?.role === 'user') {
        navigate('/dashboard', { replace: true })
      } else {
        setError('Unable to identify account role. Please try again.')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please check your credentials.'
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

      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>

        <p className="auth-subtitle">
          Login to keep watching where you left off.
        </p>

        {error && (
          <p className="auth-error" role="alert">
            <i className="bi bi-exclamation-circle"></i> {error}
          </p>
        )}

        <div className="auth-field">
          <i className="bi bi-envelope"></i>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="auth-field password-field">
          <i className="bi bi-lock"></i>

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword ? 'Hide password' : 'Show password'
            }
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
          {!loading && <i className="bi bi-arrow-right"></i>}
        </button>

        <p className="auth-switch">
          No account? <Link to="/register">Register now</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
