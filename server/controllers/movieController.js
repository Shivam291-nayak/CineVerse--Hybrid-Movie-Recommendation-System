const mongoose = require('mongoose')
const Movie = require('../models/Movie')

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// GET /api/movies
const getMovies = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 12)
    )

    const filter = {}

    if (req.query.search) {
      const search = escapeRegex(String(req.query.search).trim())
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    if (req.query.genre) {
      filter.genre = {
        $regex: escapeRegex(String(req.query.genre).trim()),
        $options: 'i',
      }
    }

    const [movies, total] = await Promise.all([
  Movie.aggregate([
    { $match: filter },
    {
      $addFields: {
        posterPriority: {
          $cond: [
            {
              $and: [
                { $ne: ['$poster', ''] },
                { $ne: ['$poster', null] }
              ]
            },
            1,
            0
          ]
        }
      }
    },
    { $sort: { posterPriority: -1, createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    { $project: { posterPriority: 0 } }
  ]),
  Movie.countDocuments(filter)
])

    res.json({
      movies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/movies/:id
const getMovieById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid movie ID.' })
    }

    const movie = await Movie.findById(req.params.id)

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' })
    }

    res.json(movie)
  } catch (error) {
    next(error)
  }
}

// POST /api/movies (admin)
const createMovie = async (req, res, next) => {
  try {
    const body = { ...req.body }

    if (!String(body.title || '').trim()) {
      return res.status(400).json({ message: 'Movie title is required.' })
    }

    body.title = String(body.title).trim()

    if (typeof body.genre === 'string') {
      body.genre = body.genre.split(',').map((item) => item.trim()).filter(Boolean)
    }

    if (!Array.isArray(body.genre)) body.genre = []

    if (typeof body.cast === 'string') {
      body.cast = body.cast.split(',').map((item) => item.trim()).filter(Boolean)
    }

    if (!Array.isArray(body.cast)) body.cast = []

    delete body.userRating
    delete body.ratingCount

    if (body.releaseYear === '') delete body.releaseYear
    if (body.rating === '') delete body.rating
    if (body.imdbRating === '') delete body.imdbRating

    const movie = await Movie.create({
      ...body,
      createdBy: req.user._id,
    })

    res.status(201).json(movie)
  } catch (error) {
    next(error)
  }
}

// PUT /api/movies/:id (admin)
const updateMovie = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid movie ID.' })
    }

    const body = { ...req.body }

    if (body.title !== undefined) {
      body.title = String(body.title).trim()

      if (!body.title) {
        return res.status(400).json({ message: 'Movie title is required.' })
      }
    }

    if (typeof body.genre === 'string') {
      body.genre = body.genre.split(',').map((item) => item.trim()).filter(Boolean)
    }

    if (typeof body.cast === 'string') {
      body.cast = body.cast.split(',').map((item) => item.trim()).filter(Boolean)
    }

    // These values are calculated by the ratings system.
    delete body._id
    delete body.createdBy
    delete body.userRating
    delete body.ratingCount

    if (body.releaseYear === '') delete body.releaseYear
    if (body.rating === '') delete body.rating
    if (body.imdbRating === '') delete body.imdbRating

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' })
    }

    res.json(movie)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/movies/:id (admin)
const deleteMovie = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid movie ID.' })
    }

    const movie = await Movie.findByIdAndDelete(req.params.id)

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' })
    }

    res.json({ message: 'Movie deleted successfully.' })
  } catch (error) {
    next(error)
  }
}

// GET /api/movies/metadata?title=MovieName (admin)
const lookupMovieMetadata = async (req, res, next) => {
  try {
    const title = String(req.query.title || '').trim()

    if (!title) {
      return res.status(400).json({
        message: 'Enter a movie title to search.',
      })
    }

    if (!process.env.OMDB_API_KEY) {
      return res.status(503).json({
        message: 'OMDb is not configured. Add OMDB_API_KEY to server/.env.',
      })
    }

    const url = new URL('https://www.omdbapi.com/')
    url.searchParams.set('apikey', process.env.OMDB_API_KEY)
    url.searchParams.set('t', title)
    url.searchParams.set('plot', 'full')

    const response = await fetch(url)

    if (!response.ok) {
      return res.status(502).json({
        message: 'Movie metadata provider is unavailable.',
      })
    }

    const data = await response.json()

    if (data.Response === 'False') {
      return res.status(404).json({
        message: data.Error || 'Movie not found.',
      })
    }

    const parsedRating =
      data.imdbRating && data.imdbRating !== 'N/A'
        ? Number(data.imdbRating)
        : null

    res.json({
      title: data.Title || '',
      description: data.Plot && data.Plot !== 'N/A' ? data.Plot : '',
      poster: data.Poster && data.Poster !== 'N/A' ? data.Poster : '',
      releaseYear:
        data.Year && /^\d{4}$/.test(data.Year)
          ? Number(data.Year)
          : undefined,
      genre:
        data.Genre && data.Genre !== 'N/A'
          ? data.Genre.split(',').map((item) => item.trim())
          : [],
      imdbId: data.imdbID || '',
      imdbRating: parsedRating,
      duration: data.Runtime && data.Runtime !== 'N/A' ? data.Runtime : '',
      language: data.Language && data.Language !== 'N/A' ? data.Language : '',
      director: data.Director && data.Director !== 'N/A' ? data.Director : '',
      cast:
        data.Actors && data.Actors !== 'N/A'
          ? data.Actors.split(',').map((item) => item.trim())
          : [],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  lookupMovieMetadata,
}
