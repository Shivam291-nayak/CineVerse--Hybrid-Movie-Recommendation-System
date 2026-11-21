import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MovieCard from '../../components/MovieCard/MovieCard.jsx'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import api from '../../services/api.js'
import './Movies.css'

const GENRES = [
  'All',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
]

function Movies() {
  const location = useLocation()
  const navigate = useNavigate()

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMovies: 0,
  })

  // Read search and genre filters from the URL.
  useEffect(() => {
    const params = new URLSearchParams(location.search)

    setSearchQuery(params.get('search') || '')
    setSelectedGenre(params.get('genre') || 'All')
    setPage(1)
  }, [location.search])

  // Fetch movies whenever the search, genre or page changes.
  const fetchMovies = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', '12')

      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim())
      }

      if (selectedGenre !== 'All') {
        params.set('genre', selectedGenre)
      }

      const response = await api.get(`/movies?${params.toString()}`)
      const data = response.data

      // Supports both a plain array and the paginated API response.
      const movieList = Array.isArray(data)
        ? data
        : Array.isArray(data.movies)
          ? data.movies
          : []

      setMovies(movieList)

      if (data.pagination) {
        setPagination(data.pagination)
      } else {
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalMovies: movieList.length,
        })
      }
    } catch (err) {
      console.error('Failed to load movies:', err)
      setMovies([])
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalMovies: 0,
      })
      setError('Unable to load movies. Please check your backend connection.')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedGenre, page])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const handleSearch = (query) => {
    const params = new URLSearchParams(location.search)
    const trimmedQuery = query.trim()

    if (trimmedQuery) {
      params.set('search', trimmedQuery)
    } else {
      params.delete('search')
    }

    params.delete('page')
    navigate(`/movies${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleGenreChange = (event) => {
    const genre = event.target.value
    const params = new URLSearchParams(location.search)

    if (genre === 'All') {
      params.delete('genre')
    } else {
      params.set('genre', genre)
    }

    params.delete('page')
    navigate(`/movies${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="movies-page">
      <div className="movies-page-header">
        <span className="movies-eyebrow">EXPLORE THE COLLECTION</span>
        <h1>Discover Movies</h1>
        <p>
          Explore your favorite genres and find your next great movie.
        </p>

        <SearchBar onSearch={handleSearch} />

        <div className="movies-filter-bar">
          <div className="movies-filter-label">
            <i className="bi bi-funnel"></i>
            <label htmlFor="movie-genre">Filter by genre</label>
          </div>

          <select
            id="movie-genre"
            value={selectedGenre}
            onChange={handleGenreChange}
            className="movies-genre-select"
          >
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre === 'All' ? 'All Genres' : genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="movies-results-header">
        <h2>
          {searchQuery.trim()
            ? `Results for "${searchQuery.trim()}"`
            : selectedGenre === 'All'
              ? 'All Movies'
              : `${selectedGenre} Movies`}
        </h2>

        {!loading && (
          <span className="movies-results-count">
            {pagination.totalMovies} movies
          </span>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="movies-empty">
          <i className="bi bi-exclamation-circle"></i>
          <p>{error}</p>
          <button
            type="button"
            className="movies-retry-button"
            onClick={fetchMovies}
          >
            Try Again
          </button>
        </div>
      ) : movies.length === 0 ? (
        <div className="movies-empty">
          <i className="bi bi-film"></i>
          <h3>No movies found</h3>
          <p>Try another title or choose a different genre.</p>

          <button
            type="button"
            className="movies-retry-button"
            onClick={() => navigate('/movies')}
          >
            View All Movies
          </button>
        </div>
      ) : (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="movies-pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <i className="bi bi-chevron-left"></i>
                Previous
              </button>

              <span>
                Page {page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Movies
