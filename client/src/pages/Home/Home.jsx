import { useEffect, useState } from 'react'
import Hero from '../../components/Hero/Hero.jsx'
import MovieCard from '../../components/MovieCard/MovieCard.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import api from '../../services/api.js'
import './Home.css'

function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/movies?limit=8')
      .then((res) => setMovies(res.data.movies || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="home-page">
      <Hero />
      <h2 className="section-title">Trending Now</h2>
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

export default Home
