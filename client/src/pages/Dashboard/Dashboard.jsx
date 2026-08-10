import { useEffect, useState } from 'react'
import StatsCard from '../../components/StatsCard/StatsCard.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ watchlistCount: 0, moviesWatched: 0 })

  useEffect(() => {
    api.get('/watchlist/stats')
      .then((res) => setStats(res.data))
      .catch(() => {})
  }, [])

  return (
    <div className="dashboard-page">
      <h1>Welcome back, {user?.name}!</h1>
      <div className="stats-row">
        <StatsCard label="Watchlist Items" value={stats.watchlistCount} icon="📺" />
        <StatsCard label="Movies Watched" value={stats.moviesWatched} icon="🎬" />
      </div>
    </div>
  )
}

export default Dashboard
