import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import '../Login/Login.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-backdrop"></div>

      <Link to="/" className="auth-logo">
        <span>Cine</span>Galaxy
      </Link>

      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p className="auth-subtitle">Join CineGalaxy and start building your watchlist.</p>

        {error && (
          <p className="auth-error">
            <i className="bi bi-exclamation-circle"></i> {error}
          </p>
        )}

        <div className="auth-field">
          <i className="bi bi-person"></i>
          <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="auth-field">
          <i className="bi bi-envelope"></i>
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="auth-field">
          <i className="bi bi-lock"></i>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="auth-submit">
          Create account
          <i className="bi bi-arrow-right"></i>
        </button>

        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  )
}

export default Register
