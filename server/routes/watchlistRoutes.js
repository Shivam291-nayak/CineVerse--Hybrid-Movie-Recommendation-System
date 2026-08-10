const express = require('express')
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlistStats,
} = require('../controllers/watchlistController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, getWatchlist)
router.post('/', protect, addToWatchlist)
router.get('/stats', protect, getWatchlistStats)
router.delete('/:id', protect, removeFromWatchlist)

module.exports = router
