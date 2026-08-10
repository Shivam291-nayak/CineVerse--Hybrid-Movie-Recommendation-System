const express = require('express')
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController')
const protect = require('../middleware/authMiddleware')
const admin = require('../middleware/adminMiddleware')

const router = express.Router()

router.get('/', getMovies)
router.get('/:id', getMovieById)
router.post('/', protect, admin, createMovie)
router.put('/:id', protect, admin, updateMovie)
router.delete('/:id', protect, admin, deleteMovie)

module.exports = router
