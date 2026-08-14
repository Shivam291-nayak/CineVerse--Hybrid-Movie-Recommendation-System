import { useEffect, useState } from 'react'
import MovieCard from '../../components/MovieCard/MovieCard.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import api from '../../services/api.js'
import './Watchlist.css'

function Watchlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/watchlist')
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <span className="movies-eyebrow">Your List</span>
        <h1>
          <i className="bi bi-bookmark-fill"></i>
          My Watchlist
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="watchlist-empty">
          <i className="bi bi-bookmark-heart"></i>
          <p>Your watchlist is empty.</p>
          <span>Start adding movies you want to watch later!</span>
        </div>
      ) : (
        <div className="movie-grid">
          {items.map((item) => (
            <MovieCard key={item._id} movie={item.movie} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist
