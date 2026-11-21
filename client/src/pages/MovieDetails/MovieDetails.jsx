
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../components/Loader/Loader.jsx'
import MovieCard from '../../components/MovieCard/MovieCard.jsx'
import MovieRating from '../../components/MovieRating/MovieRating.jsx'
import api from '../../services/api.js'
import './MovieDetails.css'

const PLACEHOLDER =
  'https://placehold.co/400x600/12151f/ffffff?text=No+Poster'

function MovieDetails() {
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [watchlistLoading, setWatchlistLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadMovie = async () => {
      setLoading(true)
      setError('')
      setMessage('')
      setMovie(null)
      setRecommendations([])

      try {
        const response = await api.get(`/movies/${id}`)

        if (cancelled) return

        const currentMovie = response.data
        setMovie(currentMovie)

        try {
          const moviesResponse = await api.get('/movies?limit=12')

          if (cancelled) return

          const data = moviesResponse.data
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data.movies)
              ? data.movies
              : []

          setRecommendations(
            list
              .filter((item) => item._id !== currentMovie._id)
              .slice(0, 6)
          )
        } catch (recommendationError) {
          console.error(
            'Could not load recommendations:',
            recommendationError
          )
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Could not load movie:', err)
          setError(
            err.response?.data?.message || 'Unable to load this movie.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadMovie()

    return () => {
      cancelled = true
    }
  }, [id])

  const addToWatchlist = async () => {
    if (!localStorage.getItem('token')) {
      setMessage('Please log in to add movies to your watchlist.')
      return
    }

    setWatchlistLoading(true)
    setMessage('')

    try {
      await api.post('/watchlist', { movieId: id })
      setMessage('Movie added to your watchlist!')
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          'Could not add this movie to your watchlist.'
      )
    } finally {
      setWatchlistLoading(false)
    }
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return ''

    try {
      const parsedUrl = new URL(url)
      let videoId = ''

      if (
        [
          'youtube.com',
          'www.youtube.com',
          'm.youtube.com',
        ].includes(parsedUrl.hostname)
      ) {
        videoId =
          parsedUrl.searchParams.get('v') ||
          parsedUrl.pathname.match(/^\/embed\/([^/]+)/)?.[1] ||
          parsedUrl.pathname.match(/^\/shorts\/([^/]+)/)?.[1] ||
          ''
      } else if (
        ['youtu.be', 'www.youtu.be'].includes(parsedUrl.hostname)
      ) {
        videoId = parsedUrl.pathname.split('/').filter(Boolean)[0] || ''
      }

      return /^[\w-]{11}$/.test(videoId)
        ? `https://www.youtube-nocookie.com/embed/${videoId}`
        : ''
    } catch {
      return ''
    }
  }

  if (loading) {
    return <Loader />
  }

  if (error || !movie) {
    return (
      <div className="details-not-found">
        <i className="bi bi-film" />
        <h2>Movie not found</h2>
        <p>{error || 'This movie may have been removed.'}</p>
        <Link to="/movies" className="details-back-button">
          Browse Movies
        </Link>
      </div>
    )
  }

  const genres = Array.isArray(movie.genre)
    ? movie.genre
    : movie.genre
      ? [movie.genre]
      : []

  const story =
    movie.story || movie.description || 'No story available yet.'

  const trailerUrl = getYouTubeEmbedUrl(
    movie.trailerUrl || movie.trailer
  )

  const displayRating = movie.imdbRating ?? movie.rating

  return (
    <div className="movie-details-page">
      <div
        className="movie-details-backdrop"
        style={{
          backgroundImage: `url("${movie.backdrop || movie.poster || PLACEHOLDER}")`,
        }}
      />

      <section className="movie-details">
        <div className="movie-poster-wrap">
          <img
            className="movie-details-poster"
            src={movie.poster || PLACEHOLDER}
            alt={`${movie.title} poster`}
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = PLACEHOLDER
            }}
          />
        </div>

        <div className="movie-info">
          <span className="details-eyebrow">MOVIE DETAILS</span>

          <h1>{movie.title}</h1>

          <div className="movie-info-meta">
            <span className="rating-pill">
              <i className="bi bi-star-fill" />
              {displayRating == null
                ? 'N/A'
                : Number(displayRating).toFixed(1)}
              <small>/10</small>
            </span>

            {movie.releaseYear && <span>{movie.releaseYear}</span>}
            {movie.duration && <span>{movie.duration}</span>}
            {movie.language && <span>{movie.language}</span>}
          </div>

          {genres.length > 0 && (
            <div className="genre-tags">
              {genres.map((genre) => (
                <span key={genre} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}

          <h3 className="details-section-label">Overview</h3>
          <p className="movie-description">{story}</p>

          <div className="movie-extra-info">
            {movie.director && (
              <div>
                <span>Director</span>
                <strong>{movie.director}</strong>
              </div>
            )}

            {Array.isArray(movie.cast) && movie.cast.length > 0 && (
              <div>
                <span>Cast</span>
                <strong>{movie.cast.join(', ')}</strong>
              </div>
            )}
          </div>

          <MovieRating movieId={movie._id} />

          <div className="movie-details-actions">
            {trailerUrl ? (
              <a
                className="watch-btn"
                href={trailerUrl}
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-play-fill" />
                Watch Trailer
              </a>
            ) : (
              <button
                type="button"
                className="watch-btn"
                disabled
                title="No trailer has been added for this movie"
              >
                <i className="bi bi-play-fill" />
                Trailer Unavailable
              </button>
            )}

            <button
              type="button"
              className="watchlist-btn"
              onClick={addToWatchlist}
              disabled={watchlistLoading}
            >
              <i className="bi bi-plus-lg" />
              {watchlistLoading ? 'Adding...' : 'Add to Watchlist'}
            </button>
          </div>

          {message && (
            <p className="details-message" role="status">
              {message}
            </p>
          )}
        </div>
      </section>

      {trailerUrl && (
        <section className="details-trailer">
          <div className="details-section-heading">
            <span />
            <h2>Official Trailer</h2>
          </div>

          <div className="trailer-frame">
            <iframe
              src={trailerUrl}
              title={`${movie.title} trailer`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="details-recommendations">
          <div className="details-section-heading">
            <span />
            <h2>You May Also Like</h2>
            <Link to="/movies">View All</Link>
          </div>

          <div className="details-recommendation-grid">
            {recommendations.map((item) => (
              <MovieCard key={item._id} movie={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default MovieDetails
