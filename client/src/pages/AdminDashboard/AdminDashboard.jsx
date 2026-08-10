import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatsCard from '../../components/StatsCard/StatsCard.jsx'
import api from '../../services/api.js'
import './AdminDashboard.css'

function AdminDashboard() {
  const [stats, setStats] = useState({ totalMovies: 0, totalUsers: 0 })

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => {})
  }, [])

  return (
    <div className="admin-dashboard-page">
      <h1>Admin Dashboard</h1>
      <div className="stats-row">
        <StatsCard label="Total Movies" value={stats.totalMovies} icon="🎬" />
        <StatsCard label="Total Users" value={stats.totalUsers} icon="👥" />
      </div>
      <Link to="/admin/add-movie" className="add-movie-btn">+ Add New Movie</Link>
    </div>
  )
}

export default AdminDashboard
