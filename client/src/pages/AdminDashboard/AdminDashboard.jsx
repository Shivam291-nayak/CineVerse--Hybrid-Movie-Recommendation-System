
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatsCard from '../../components/StatsCard/StatsCard.jsx'
import api from '../../services/api.js'
import './AdminDashboard.css'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalWatchlists: 0,
  })
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [statsResponse, moviesResponse] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/movies?limit=48'),
      ])

      setStats(statsResponse.data)
      const result = moviesResponse.data
      setMovies(Array.isArray(result) ? result : result.movies || [])
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not load dashboard. Check your admin session and backend.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const handleDelete = async (movie) => {
    const confirmed = window.confirm(
      `Delete "${movie.title}"? This action cannot be undone.`
    )
    if (!confirmed) return

    setError('')
    setNotice('')

    try {
      await api.delete(`/movies/${movie._id}`)
      setMovies((current) => current.filter((item) => item._id !== movie._id))
      setStats((current) => ({
        ...current,
        totalMovies: Math.max(0, current.totalMovies - 1),
      }))
      setNotice(`"${movie.title}" was deleted.`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete movie.')
    }
  }

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-header">
        <span className="movies-eyebrow">CineVerse Admin</span>
        <h1>Admin Dashboard</h1>
        <p>Manage your movie catalog and monitor platform activity.</p>
      </div>

      <div className="stats-row">
        <StatsCard label="Total Movies" value={stats.totalMovies} icon="🎬" />
        <StatsCard label="Total Users" value={stats.totalUsers} icon="👥" />
        <StatsCard
          label="Watchlist Entries"
          value={stats.totalWatchlists}
          icon="📋"
        />
      </div>

      <div className="admin-toolbar">
        <h2>Movie Catalog</h2>
        <div>
          <button
            className="admin-refresh-btn"
            type="button"
            onClick={loadDashboard}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise" /> Refresh
          </button>
          <Link to="/admin/add-movie" className="add-movie-btn">
            <i className="bi bi-plus-lg" /> Add New Movie
          </Link>
        </div>
      </div>

      {error && <p className="admin-message admin-message-error">{error}</p>}
      {notice && <p className="admin-message admin-message-success">{notice}</p>}

      {loading ? (
        <p className="admin-empty-state">Loading dashboard...</p>
      ) : movies.length === 0 ? (
        <div className="admin-empty-state">
          <i className="bi bi-film" />
          <h3>No movies found</h3>
          <p>Add your first movie to the CineVerse catalog.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-movie-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Year</th>
                <th>IMDb</th>
                <th>User Rating</th>
                <th>Trailer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>
                    <div className="admin-movie-info">
                      <img
                        src={
                          movie.poster ||
                          'https://placehold.co/60x85/12151f/ffffff?text=No+Poster'
                        }
                        alt=""
                        onError={(event) => {
                          event.currentTarget.src =
                            'https://placehold.co/60x85/12151f/ffffff?text=No+Poster'
                        }}
                      />
                      <div>
                        <strong>{movie.title}</strong>
                        <span>
                          {Array.isArray(movie.genre)
                            ? movie.genre.join(', ')
                            : movie.genre || 'No genre'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{movie.releaseYear || '—'}</td>
                  <td>
                    {movie.imdbRating == null
                      ? '—'
                      : `★ ${Number(movie.imdbRating).toFixed(1)}`}
                  </td>
                  <td>
                    {movie.userRating == null
                      ? '—'
                      : `★ ${Number(movie.userRating).toFixed(1)} (${movie.ratingCount || 0})`}
                  </td>
                  <td>
                    {movie.trailerUrl ? (
                      <a href={movie.trailerUrl} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : '—'}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <Link to={`/admin/edit-movie/${movie._id}`}>Edit</Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(movie)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
