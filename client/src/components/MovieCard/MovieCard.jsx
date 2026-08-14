import { Link } from 'react-router-dom'
import './MovieCard.css'

function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie._id}`} className="movie-card">
      <div className="movie-card-poster">
        <img src={movie.poster || '/images/placeholder.png'} alt={movie.title} />

        <span className="movie-rating">
          <i className="bi bi-star-fill"></i>
          {movie.rating ?? movie.imdbRating ?? 'N/A'}
        </span>

        <div className="movie-card-overlay">
          <button className="movie-card-play" type="button" aria-label="Play">
            <i className="bi bi-play-fill"></i>
          </button>
        </div>
      </div>

      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        <p>{Array.isArray(movie.genre) ? movie.genre.join(' · ') : movie.genre}</p>
      </div>
    </Link>
  )
}

export default MovieCard
