import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
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
        <p className="auth-subtitle">Login to keep watching where you left off.</p>

        {error && (
          <p className="auth-error">
            <i className="bi bi-exclamation-circle"></i> {error}
          </p>
        )}

        <div className="auth-field">
          <i className="bi bi-envelope"></i>
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="auth-field">
          <i className="bi bi-lock"></i>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="auth-submit">
          Login
          <i className="bi bi-arrow-right"></i>
        </button>

        <p className="auth-switch">No account? <Link to="/register">Register now</Link></p>
      </form>
    </div>
  )
}

export default Login
