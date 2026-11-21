
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import './Home.css'

const PLACEHOLDER =
  'https://placehold.co/300x450/12151f/ffffff?text=No+Poster'

function Home() {
  const [movies, setMovies] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [recommendationLoading, setRecommendationLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const fetchMovies = async () => {
      try {
        const { data } = await api.get('/movies?limit=48')

        const movieList = Array.isArray(data)
          ? data
          : Array.isArray(data.movies)
            ? data.movies
            : []

        if (active) setMovies(movieList)
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Unable to load movies.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    const fetchRecommendations = async () => {
      try {
        const { data } = await api.get('/hybrid')

        if (active) {
          setRecommendations(data.recommendations || [])
        }
      } catch (err) {
        console.error('Hybrid recommendation error:', err)
      } finally {
        if (active) setRecommendationLoading(false)
      }
    }

    fetchMovies()
    fetchRecommendations()

    return () => {
      active = false
    }
  }, [])

  const featuredMovie = movies[0]

  const trendingMovies = [...movies]
    .sort(
      (a, b) =>
        Number(b.imdbRating ?? b.rating ?? 0) -
        Number(a.imdbRating ?? a.rating ?? 0)
    )
    .slice(0, 8)

  const popularMovies = movies.slice(0, 12)

  const getRating = (movie) => {
    const rating = movie.imdbRating ?? movie.rating
    return rating != null && rating !== '' && Number(rating) > 0
  ? Number(rating).toFixed(1)
  : 'N/A'
  }

  const MovieCard = ({ movie }) => (
    <Link
      to={`/movies/${movie._id}`}
      className="home-movie-card"
    >
      <div className="home-movie-poster">
        <img
          src={movie.poster || PLACEHOLDER}
          alt={`${movie.title} poster`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = PLACEHOLDER
          }}
        />
        <span className="home-movie-rating">
          ★ {getRating(movie)}
        </span>
      </div>

      <div className="home-movie-info">
        <h3>{movie.title}</h3>
        <p>
          {movie.releaseYear || 'Year unavailable'}
          {' · '}
          {Array.isArray(movie.genre)
            ? movie.genre.slice(0, 2).join(', ')
            : movie.genre || 'Movie'}
        </p>
      </div>
    </Link>
  )

  if (loading) {
    return (
      <div className="home-status">
        <p>Loading CineVerse...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-status">
        <h2>Unable to load CineVerse</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  if (!movies.length) {
    return (
      <div className="home-status">
        <h2>Welcome to CineVerse</h2>
        <p>No movies available.</p>
        <Link to="/movies">Explore Movies</Link>
      </div>
    )
  }

  return (
    <div className="home-page">

      {featuredMovie && (
        <section
          className="home-hero"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(5,8,16,.96), rgba(5,8,16,.2)), linear-gradient(0deg, #050810, transparent 45%), url("${featuredMovie.backdrop || featuredMovie.poster || ''}")`
          }}
        >
          <div className="home-hero-content">
            <span className="home-eyebrow">
              CINEVERSE ORIGINAL DISCOVERY
            </span>

            <h1>{featuredMovie.title}</h1>

            <div className="home-hero-meta">
              <span>{featuredMovie.releaseYear}</span>
              <span>★ {getRating(featuredMovie)}</span>
              <span>
                {Array.isArray(featuredMovie.genre)
                  ? featuredMovie.genre.join(' / ')
                  : featuredMovie.genre}
              </span>
            </div>

            <p className="home-hero-description">
              {featuredMovie.description ||
                'Discover your next favorite movie with CineVerse.'}
            </p>

            <div className="home-hero-actions">
              <Link
                to={`/movies/${featuredMovie._id}`}
                className="home-primary-button"
              >
                ▶ Watch Details
              </Link>

              <Link
                to="/movies"
                className="home-secondary-button"
              >
                Explore Movies
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="home-content">

        {/* HYBRID RECOMMENDATIONS */}
        <section className="home-movie-section">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">
                AI POWERED FOR YOU
              </span>
              <h2>Recommended For You</h2>
            </div>
          </div>

          {recommendationLoading ? (
            <p className="home-recommendation-status">
              Finding movies for you...
            </p>
          ) : recommendations.length > 0 ? (
            <>
              <p className="home-recommendation-subtitle">
                Personalized recommendations powered by our Hybrid
                Recommendation Engine.
              </p>

              <div className="home-movie-grid">
                {recommendations.map((item) => (
                  <div
                    className="home-recommendation-card"
                    key={item.movie._id}
                  >
                    <MovieCard movie={item.movie} />

                    <div className="home-hybrid-score">
                      <span>Hybrid Match</span>
                      <strong>
                        {Number(item.hybridScore).toFixed(1)} / 5
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="home-recommendation-status">
              Rate some movies to receive personalized recommendations.
            </p>
          )}
        </section>

        {/* TRENDING */}
        <section className="home-movie-section">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">WHAT'S HOT</span>
              <h2>Trending Now</h2>
            </div>
            <Link to="/movies">View All →</Link>
          </div>

          <div className="home-movie-grid">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        {/* POPULAR */}
        <section className="home-movie-section">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">DISCOVER MORE</span>
              <h2>Popular Movies</h2>
            </div>
            <Link to="/movies">Explore All →</Link>
          </div>

          <div className="home-movie-grid">
            {popularMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

export default Home
