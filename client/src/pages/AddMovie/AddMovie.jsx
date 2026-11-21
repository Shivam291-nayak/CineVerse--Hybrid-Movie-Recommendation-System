
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'
import './AddMovie.css'

const initialForm = {
  title: '',
  genre: '',
  description: '',
  poster: '',
  backdrop: '',
  releaseYear: '',
  rating: '',
  imdbId: '',
  imdbRating: '',
  trailerUrl: '',
  duration: '',
  language: '',
  director: '',
  cast: '',
}

function AddMovie() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/movies', {
        ...form,
        genre: form.genre.split(',').map((item) => item.trim()).filter(Boolean),
        cast: form.cast.split(',').map((item) => item.trim()).filter(Boolean),
        releaseYear: form.releaseYear ? Number(form.releaseYear) : undefined,
        rating: form.rating ? Number(form.rating) : 0,
        imdbRating: form.imdbRating ? Number(form.imdbRating) : null,
      })

      navigate('/admin/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not add movie. Check your admin login and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    ['poster', 'Poster image URL'],
    ['backdrop', 'Backdrop image URL'],
    ['trailerUrl', 'YouTube trailer URL'],
    ['imdbId', 'IMDb ID (e.g. tt0133093)'],
    ['duration', 'Duration (e.g. 2h 16m)'],
    ['language', 'Language'],
    ['director', 'Director'],
    ['cast', 'Cast (comma separated)'],
  ]

  return (
    <div className="add-movie-page">
      <div className="add-movie-header">
        <span className="movies-eyebrow">CineVerse Admin</span>
        <h1>Add New Movie</h1>
        <p>Add movie details, artwork, trailer, and rating information.</p>
      </div>

      {error && <p className="auth-error" role="alert">{error}</p>}

      <form className="add-movie-form" onSubmit={handleSubmit}>
        <label>
          Movie title *
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. The Matrix"
            required
          />
        </label>

        <label>
          Genres * <span>(comma separated)</span>
          <input
            name="genre"
            value={form.genre}
            onChange={handleChange}
            placeholder="Sci-Fi, Action"
            required
          />
        </label>

        <label>
          Story / Description *
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write the movie synopsis..."
            required
          />
        </label>

        <div className="add-movie-form-row">
          <label>
            Release year
            <input
              name="releaseYear"
              type="number"
              min="1888"
              max="2100"
              value={form.releaseYear}
              onChange={handleChange}
            />
          </label>
          <label>
            IMDb rating (0–10)
            <input
              name="imdbRating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={form.imdbRating}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="add-movie-form-row">
          <label>
            Existing catalog rating (0–10)
            <input
              name="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
            />
          </label>
          <label>
            Language
            <input
              name="language"
              value={form.language}
              onChange={handleChange}
              placeholder="English"
            />
          </label>
        </div>

        {fields.map(([name, placeholder]) => (
          <label key={name}>
            {placeholder}
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
            />
          </label>
        ))}

        {form.poster && (
          <div className="movie-poster-preview">
            <span>Poster preview</span>
            <img
              src={form.poster}
              alt="Movie poster preview"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          <i className="bi bi-plus-lg" />
          {loading ? 'Saving movie...' : 'Add Movie'}
        </button>
      </form>
    </div>
  )
}

export default AddMovie
