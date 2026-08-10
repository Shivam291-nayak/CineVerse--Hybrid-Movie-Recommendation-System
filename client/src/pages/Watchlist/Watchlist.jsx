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
      <h1>My Watchlist</h1>
      {items.length === 0 ? (
        <p>Your watchlist is empty. Start adding movies!</p>
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
