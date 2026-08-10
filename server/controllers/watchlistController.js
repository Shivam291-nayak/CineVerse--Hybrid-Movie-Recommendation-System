const Watchlist = require('../models/Watchlist')

// @desc Get user's watchlist
// @route GET /api/watchlist
const getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ user: req.user._id }).populate('movie')
    res.json(items)
  } catch (err) {
    next(err)
  }
}

// @desc Add movie to watchlist
// @route POST /api/watchlist
const addToWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.body
    const exists = await Watchlist.findOne({ user: req.user._id, movie: movieId })
    if (exists) return res.status(400).json({ message: 'Already in watchlist' })

    const item = await Watchlist.create({ user: req.user._id, movie: movieId })
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

// @desc Remove movie from watchlist
// @route DELETE /api/watchlist/:id
const removeFromWatchlist = async (req, res, next) => {
  try {
    const item = await Watchlist.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json({ message: 'Removed from watchlist' })
  } catch (err) {
    next(err)
  }
}

// @desc Get watchlist stats
// @route GET /api/watchlist/stats
const getWatchlistStats = async (req, res, next) => {
  try {
    const watchlistCount = await Watchlist.countDocuments({ user: req.user._id })
    const moviesWatched = await Watchlist.countDocuments({ user: req.user._id, watched: true })
    res.json({ watchlistCount, moviesWatched })
  } catch (err) {
    next(err)
  }
}

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist, getWatchlistStats }
