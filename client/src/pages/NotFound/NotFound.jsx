import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <div className="not-found-page">
      <span className="not-found-code">404</span>
      <h1>Lost the plot?</h1>
      <p>This page doesn't exist. Let's get you back to something worth watching.</p>
      <Link to="/">
        <i className="bi bi-house-door-fill"></i>
        Go back home
      </Link>
    </div>
  )
}

export default NotFound
