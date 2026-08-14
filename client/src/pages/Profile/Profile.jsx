import { useAuth } from '../../context/AuthContext.jsx'
import StatsCard from '../../components/StatsCard/StatsCard.jsx'
import './Profile.css'

function Profile() {
  const { user } = useAuth()

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-lg">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div>
          <h1>{user?.name || 'User'}</h1>
          <p className="profile-email">{user?.email}</p>
          <span className="profile-role-badge">{user?.role || 'user'}</span>
        </div>
      </div>

      <div className="profile-section">
        <h2 className="profile-section-title">
          <i className="bi bi-bar-chart-fill"></i>
          Usage
        </h2>

        <div className="profile-stats-row">
          <StatsCard label="Movies Watched" value={user?.moviesWatched ?? 0} icon="🎬" />
          <StatsCard label="Watchlist Items" value={user?.watchlistCount ?? 0} icon="📺" />
          <StatsCard label="Member Since" value={user?.createdAt ? new Date(user.createdAt).getFullYear() : '—'} icon="⭐" />
        </div>
      </div>
    </div>
  )
}

export default Profile
