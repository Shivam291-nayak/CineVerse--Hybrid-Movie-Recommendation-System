
import { useEffect, useState } from 'react'
import MovieCard from '../../components/MovieCard/MovieCard.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import api from '../../services/api.js'
import './TVShows.css'

function TVShows() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    api.get('/movies?limit=24')
      .then(({ data }) => {
        if (!active) return

        const list = Array.isArray(data) ? data : data.movies || []
        setShows(list)
      })
      .catch(() => {
        if (active) setError('Could not load shows.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="tv-shows-page">
      <header className="tv-shows-header">
        <span className="movies-eyebrow">EXPLORE EPISODIC ENTERTAINMENT</span>
        <h1>TV Shows</h1>
        <p>Discover your next favourite series on CineVerse.</p>
      </header>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="tv-shows-message">{error}</p>
      ) : shows.length === 0 ? (
        <p className="tv-shows-message">No shows available yet.</p>
      ) : (
        <div className="tv-shows-grid">
          {shows.map((show) => (
            <MovieCard key={show._id} movie={show} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TVShows
