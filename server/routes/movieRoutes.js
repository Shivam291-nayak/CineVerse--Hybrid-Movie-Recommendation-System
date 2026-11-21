
const express = require('express')
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  lookupMovieMetadata,
} = require('../controllers/movieController')

const protect = require('../middleware/authMiddleware')
const admin = require('../middleware/adminMiddleware')

const router = express.Router()

// Public routes
router.get('/', getMovies)
router.get('/metadata', protect, admin, lookupMovieMetadata)
router.get('/:id', getMovieById)
// Admin-only routes
router.post('/', protect, admin, createMovie)
router.put('/:id', protect, admin, updateMovie)
router.delete('/:id', protect, admin, deleteMovie)

module.exports = router
