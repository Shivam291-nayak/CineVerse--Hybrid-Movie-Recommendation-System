import { useEffect, useState } from 'react'
import MovieCard from '../../components/MovieCard/MovieCard.jsx'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import api from '../../services/api.js'
import './Movies.css'

function Movies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMovies = (query = '') => {
    setLoading(true)
    api.get(`/movies${query ? `?search=${query}` : ''}`)
      .then((res) => setMovies(res.data.movies || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return (
    <div className="movies-page">
      <div className="movies-page-header">
        <span className="movies-eyebrow">Browse</span>
        <h1>All Movies</h1>
        <p>Explore the full catalog and find your next watch.</p>

        <SearchBar onSearch={fetchMovies} />
      </div>

      {loading ? (
        <Loader />
      ) : movies.length === 0 ? (
        <div className="movies-empty">
          <i className="bi bi-film"></i>
          <p>No movies found. Try a different search.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Movies
