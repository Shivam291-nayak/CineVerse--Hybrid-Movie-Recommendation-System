import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <Link to="/" className="footer-logo">
            <span>Cine</span>Galaxy
          </Link>

          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
            <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" aria-label="Youtube"><i className="bi bi-youtube"></i></a>
          </div>
        </div>

        <div className="footer-links">
          <Link to="/movies">Movies</Link>
          <Link to="/watchlist">Watchlist</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-divider"></div>

        <p>&copy; {new Date().getFullYear()} CineGalaxy — Movie Recommendation System. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
