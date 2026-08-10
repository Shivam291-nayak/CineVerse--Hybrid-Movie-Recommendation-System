const Movie = require('../models/Movie')

// @desc Get all movies (supports ?search=)
// @route GET /api/movies
const getMovies = async (req, res, next) => {
  try {
    const { search, limit } = req.query
    const filter = search ? { title: { $regex: search, $options: 'i' } } : {}
    let query = Movie.find(filter).sort({ createdAt: -1 })
    if (limit) query = query.limit(Number(limit))
    const movies = await query
    res.json(movies)
  } catch (err) {
    next(err)
  }
}

// @desc Get single movie
// @route GET /api/movies/:id
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    res.json(movie)
  } catch (err) {
    next(err)
  }
}

// @desc Create movie (admin)
// @route POST /api/movies
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, createdBy: req.user._id })
    res.status(201).json(movie)
  } catch (err) {
    next(err)
  }
}

// @desc Update movie (admin)
// @route PUT /api/movies/:id
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    res.json(movie)
  } catch (err) {
    next(err)
  }
}

// @desc Delete movie (admin)
// @route DELETE /api/movies/:id
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    res.json({ message: 'Movie removed' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie }
