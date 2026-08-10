import { Link } from 'react-router-dom'
import './MovieCard.css'

function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie._id}`} className="movie-card">
      <img src={movie.poster || '/images/placeholder.png'} alt={movie.title} />
      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        <p>{movie.genre?.join(', ')}</p>
        <span className="movie-rating">⭐ {movie.rating ?? 'N/A'}</span>
      </div>
    </Link>
  )
}

export default MovieCard
