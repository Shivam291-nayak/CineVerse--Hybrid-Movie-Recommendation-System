import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'
import './AddMovie.css'

function AddMovie() {
  const [form, setForm] = useState({
    title: '', genre: '', description: '', poster: '', releaseYear: '', rating: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/movies', {
        ...form,
        genre: form.genre.split(',').map((g) => g.trim()),
        releaseYear: Number(form.releaseYear),
        rating: Number(form.rating),
      })
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add movie')
    }
  }

  return (
    <div className="add-movie-page">
      <h1>Add New Movie</h1>
      {error && <p className="auth-error">{error}</p>}
      <form className="add-movie-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="genre" placeholder="Genre (comma separated)" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input name="poster" placeholder="Poster URL" onChange={handleChange} />
        <input name="releaseYear" type="number" placeholder="Release Year" onChange={handleChange} />
        <input name="rating" type="number" step="0.1" placeholder="Rating" onChange={handleChange} />
        <button type="submit">Add Movie</button>
      </form>
    </div>
  )
}

export default AddMovie
