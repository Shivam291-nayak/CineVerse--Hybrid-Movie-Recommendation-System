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
  if (!movie) return <p>Movie not found.</p>

  return (
    <div className="movie-details">
      <img src={movie.poster || '/images/placeholder.png'} alt={movie.title} />
      <div className="movie-info">
        <h1>{movie.title}</h1>
        <p className="genre">{movie.genre?.join(', ')}</p>
        <p>{movie.description}</p>
        <p><strong>Rating:</strong> ⭐ {movie.rating ?? 'N/A'}</p>
        <p><strong>Release Year:</strong> {movie.releaseYear}</p>
        <button onClick={addToWatchlist}>Add to Watchlist</button>
        {message && <p className="details-message">{message}</p>}
      </div>
    </div>
  )
}

export default MovieDetails
