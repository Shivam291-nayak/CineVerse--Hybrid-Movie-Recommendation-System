
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api.js'
import '../AddMovie/AddMovie.css'

function EditMovie() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
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
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    api.get(`/movies/${id}`)
      .then(({ data }) => {
  if (!active) return

  setForm({
    title: data.title || '',
    genre: Array.isArray(data.genre)
      ? data.genre.join(', ')
      : data.genre || '',
    description: data.description || '',
    poster: data.poster || '',
    backdrop: data.backdrop || '',
    releaseYear: data.releaseYear ?? '',
    rating: data.rating ?? '',
    imdbId: data.imdbId || '',
    imdbRating: data.imdbRating ?? '',
    trailerUrl: data.trailerUrl || '',
    duration: data.duration || '',
    language: data.language || '',
    director: data.director || '',
    cast: Array.isArray(data.cast)
      ? data.cast.join(', ')
      : data.cast || '',
  })
})
      .catch((err) => {
        if (active) {
          setError(err.response?.data?.message || 'Could not load movie.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await api.put(`/movies/${id}`, {
        ...form,
        genre: form.genre.split(',').map((item) => item.trim()).filter(Boolean),
        cast: form.cast.split(',').map((item) => item.trim()).filter(Boolean),
        releaseYear: form.releaseYear ? Number(form.releaseYear) : undefined,
        rating: form.rating === '' ? 0 : Number(form.rating),
        imdbRating: form.imdbRating === '' ? null : Number(form.imdbRating),
      })
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update movie.')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    ['poster', 'Poster image URL'],
    ['backdrop', 'Backdrop image URL'],
    ['trailerUrl', 'YouTube trailer URL'],
    ['imdbId', 'IMDb ID'],
    ['duration', 'Duration'],
    ['language', 'Language'],
    ['director', 'Director'],
    ['cast', 'Cast (comma separated)'],
  ]

  if (loading) {
    return <div className="add-movie-page">Loading movie...</div>
  }

  return (
    <div className="add-movie-page">
      <div className="add-movie-header">
        <span className="movies-eyebrow">CineVerse Admin</span>
        <h1>Edit Movie</h1>
        <p>Update this movie's details.</p>
      </div>

      {error && <p className="auth-error" role="alert">{error}</p>}

      <form className="add-movie-form" onSubmit={handleSubmit}>
        <label>
          Title *
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Genres *
          <input name="genre" value={form.genre} onChange={handleChange} required />
        </label>
        <label>
          Story / Description
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>

        <div className="add-movie-form-row">
          <label>
            Release year
            <input name="releaseYear" type="number" value={form.releaseYear} onChange={handleChange} />
          </label>
          <label>
            IMDb rating
            <input name="imdbRating" type="number" min="0" max="10" step="0.1" value={form.imdbRating} onChange={handleChange} />
          </label>
        </div>

        {fields.map(([name, placeholder]) => (
          <label key={name}>
            {placeholder}
            <input name={name} value={form[name]} onChange={handleChange} />
          </label>
        ))}

        <button type="submit" disabled={saving}>
          {saving ? 'Saving changes...' : 'Save Changes'}
        </button>
        <Link to="/admin/dashboard">Cancel</Link>
      </form>
    </div>
  )
}

export default EditMovie
