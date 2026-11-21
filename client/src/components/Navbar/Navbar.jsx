import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Navbar.css'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setNotificationsOpen(false)
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="cg-navbar">
      <div className="cg-navbar-inner">
        {/* Logo */}
        <Link to="/" className="cg-logo">
          <span>Cine</span>Verse
        </Link>

        {/* Navigation */}
        <div className="cg-nav-links">
          <Link
            to="/"
            className={`cg-nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>

          <Link
            to="/movies"
            className={`cg-nav-link ${
              isActive('/movies') ? 'active' : ''
            }`}
          >
            Movies
          </Link>

          <Link
  to="/tv-shows"
  className={`cg-nav-link ${
    location.pathname === '/tv-shows' ? 'active' : ''
  }`}
>
  TV Shows
</Link>
          <Link
            to="/watchlist"
            className={`cg-nav-link ${
              isActive('/watchlist') ? 'active' : ''
            }`}
          >
            Watchlist
          </Link>

          <div className="cg-genres">
            <button
              type="button"
              className="cg-nav-link cg-genre-button"
            >
              Genres
              <i className="bi bi-chevron-down"></i>
            </button>

            <div className="cg-genre-menu">
              {[
                'Action',
                'Comedy',
                'Drama',
                'Horror',
                'Romance',
                'Sci-Fi',
                'Thriller',
              ].map((genre) => (
                <Link
                  key={genre}
                  to={`/movies?genre=${encodeURIComponent(genre)}`}
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Notifications and Profile */}
        <div className="cg-navbar-right">
          {/* Notifications */}
          <div className="cg-notifications">
            <button
              type="button"
              className="cg-icon-button"
              onClick={() =>
                setNotificationsOpen((open) => !open)
              }
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              title="Notifications"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </svg>
            </button>

            {notificationsOpen && (
              <div className="cg-notification-menu">
                <strong>Notifications</strong>
                <p>You’re all caught up!</p>
              </div>
            )}
          </div>

          {/* Profile */}
          {isAuthenticated ? (
            <div className="cg-profile">
              <button
                type="button"
                className="cg-profile-button"
                aria-label="Open profile menu"
              >
                <div className="cg-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>

              <div className="cg-profile-menu">
                <div className="profile-menu-user">
                  <div className="cg-avatar large">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>

                  <div>
                    <strong>{user?.name || 'User'}</strong>
                    <small>{user?.email || ''}</small>
                  </div>
                </div>

                <div className="profile-divider"></div>

                <Link
                  to="/profile"
                  className="profile-usage-tab"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <i className="bi bi-person-circle"></i>
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/watchlist"
                  className="profile-usage-tab"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <i className="bi bi-bookmark-heart"></i>
                  <span>My Watchlist</span>
                </Link>

                <button
                  type="button"
                  className="profile-logout-btn"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="cg-login-button">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
