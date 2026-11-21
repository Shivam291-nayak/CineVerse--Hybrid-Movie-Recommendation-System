import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from '../../components/MovieCard/MovieCard.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import api from '../../services/api.js'
import './Watchlist.css'

function Watchlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    api.get('/watchlist')
      .then((res) => {
        if (active) {
          setItems(Array.isArray(res.data) ? res.data : [])
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
            'Could not load your watchlist.'
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleRemove = async (item) => {
    const movie = item.movie

    if (!movie?._id) {
      setError('Could not identify this movie.')
      return
    }

    const confirmed = window.confirm(
      `Remove "${movie.title}" from your watchlist?`
    )

    if (!confirmed) return

    setRemovingId(item._id)
    setError('')
    setMessage('')

    try {
      // This assumes your DELETE endpoint accepts the movie ID.
      await api.delete(`/watchlist/${item._id}`)

      setItems((current) =>
        current.filter((entry) => entry._id !== item._id)
      )

      setMessage(`"${movie.title}" was removed from your watchlist.`)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not remove this movie. Please check your watchlist API.'
      )
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <span className="movies-eyebrow">Your List</span>
        <h1>
          <i className="bi bi-bookmark-fill"></i>
          My Watchlist
        </h1>
      </div>

      {error && (
        <p className="watchlist-message watchlist-message-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="watchlist-message watchlist-message-success" role="status">
          {message}
        </p>
      )}

      {items.length === 0 ? (
        <div className="watchlist-empty">
          <i className="bi bi-bookmark-heart"></i>
          <p>Your watchlist is empty.</p>
          <span>Start adding movies you want to watch later!</span>
          <Link to="/movies" className="watchlist-browse-btn">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="movie-grid watchlist-grid">
          {items.map((item) => (
            <div className="watchlist-card" key={item._id}>
              {item.movie && (
                <>
                  <button
                    type="button"
                    className="watchlist-remove-btn"
                    onClick={() => handleRemove(item)}
                    disabled={removingId === item._id}
                    aria-label={`Remove ${item.movie.title} from watchlist`}
                    title="Remove from watchlist"
                  >
                    {removingId === item._id ? (
                      <span className="watchlist-remove-loading">…</span>
                    ) : (
                      <span className="remove-cross" aria-hidden="true">×</span>
                    )}
                  </button>

                  <MovieCard movie={item.movie} />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist