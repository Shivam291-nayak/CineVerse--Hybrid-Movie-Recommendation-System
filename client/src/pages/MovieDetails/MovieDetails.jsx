import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../../components/Loader/Loader.jsx'
import api from '../../services/api.js'
import './MovieDetails.css'

function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get(`/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const addToWatchlist = async () => {
    try {
      await api.post('/watchlist', { movieId: id })
      setMessage('Added to watchlist!')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add')
    }
  }

  if (loading) return <Loader />
  if (!movie) return <p className="details-not-found">Movie not found.</p>

  return (
    <div className="movie-details-page">
      <div
        className="movie-details-backdrop"
        style={{ backgroundImage: `url(${movie.backdrop || movie.poster || '/images/placeholder.png'})` }}
      ></div>

      <div className="movie-details">
        <img src={movie.poster || '/images/placeholder.png'} alt={movie.title} />

        <div className="movie-info">
          <h1>{movie.title}</h1>

          <div className="movie-info-meta">
            <span className="rating-pill">
              <i className="bi bi-star-fill"></i> {movie.rating ?? 'N/A'}
            </span>
            {movie.releaseYear && <span>{movie.releaseYear}</span>}
            {movie.duration && <span>{movie.duration}</span>}
          </div>

          {movie.genre?.length > 0 && (
            <div className="genre-tags">
              {movie.genre.map((g) => (
                <span key={g} className="genre-tag">{g}</span>
              ))}
            </div>
          )}

          <p className="movie-description">{movie.description}</p>

          <div className="movie-details-actions">
            <button className="watch-btn">
              <i className="bi bi-play-fill"></i>
              Watch Now
            </button>

            <button className="watchlist-btn" onClick={addToWatchlist}>
              <i className="bi bi-plus-lg"></i>
              Add to Watchlist
            </button>
          </div>

          {message && <p className="details-message">{message}</p>}
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
