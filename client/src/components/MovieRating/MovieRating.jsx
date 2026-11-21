
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'
import './MovieRating.css'

function MovieRating({ movieId }) {
  const { user } = useAuth()

  const [selected, setSelected] = useState(0)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [yourRating, setYourRating] = useState(null)

  useEffect(() => {
    let active = true

    const loadRatings = async () => {
      try {
        const { data } = await api.get('/ratings/my-ratings')

        const existing = data.find(
          (item) => item.movie?._id === movieId
        )

        if (active) {
          setYourRating(existing?.rating ?? null)
          setSelected(existing?.rating ?? 0)
        }
      } catch (err) {
        if (active) {
          setError('Could not load your rating.')
        }
      } finally {
        if (active) setFetching(false)
      }
    }

    if (user && movieId) {
      loadRatings()
    } else {
      setFetching(false)
    }

    return () => {
      active = false
    }
  }, [movieId, user])

  const submitRating = async () => {
    if (!user) {
      setError('Please log in to rate this movie.')
      return
    }

    if (selected < 1 || selected > 5) {
      setError('Choose a rating between 1 and 5.')
      return
    }

    setSaving(true)
    setError('')
    setMessage('')

    try {
      await api.post('/ratings', {
        movieId,
        rating: selected,
      })

      setYourRating(selected)
      setMessage('Your rating has been saved successfully.')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not save your rating. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="movie-rating" aria-label="Movie ratings">
      <div className="movie-rating-summary">
        <span className="movie-rating-label">
          CineVerse Movie Rating
        </span>

        <strong className="movie-rating-score">
          <span>★</span> {yourRating ?? 'N/A'}
          <small>/5</small>
        </strong>

        <p className="movie-rating-count">
          {yourRating !== null
            ? 'Your submitted rating'
            : 'Not rated yet'}
        </p>
      </div>

      <div className="movie-rating-input">
        <label htmlFor={`rating-${movieId}`}>
          {yourRating !== null ? 'Update your rating' : 'Your rating'}
        </label>

        <select
          id={`rating-${movieId}`}
          value={selected}
          onChange={(event) => {
            setSelected(Number(event.target.value))
            setError('')
            setMessage('')
          }}
          disabled={!user || fetching || saving}
        >
          <option value={0}>Choose a rating</option>

          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value} / 5
            </option>
          ))}
        </select>

        {user ? (
          <button
            type="button"
            onClick={submitRating}
            disabled={fetching || saving || !selected}
          >
            {saving
              ? 'Saving...'
              : yourRating !== null
                ? 'Update Rating'
                : 'Submit Rating'}
          </button>
        ) : (
          <p className="movie-rating-login">
            <Link to="/login">Log in</Link> to rate this movie.
          </p>
        )}
      </div>

      {message && (
        <p className="movie-rating-success" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="movie-rating-error" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}

export default MovieRating
