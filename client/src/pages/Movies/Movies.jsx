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
      <h1>Browse Movies</h1>
      <SearchBar onSearch={fetchMovies} />
      {loading ? (
        <Loader />
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
