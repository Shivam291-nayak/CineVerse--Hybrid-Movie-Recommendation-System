import { Link } from 'react-router-dom'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <h1>Find Your Next Favorite Movie</h1>
      <p>Personalized recommendations, curated watchlists, and more.</p>
      <Link to="/movies" className="hero-cta">Browse Movies</Link>
    </section>
  )
}

export default Hero
