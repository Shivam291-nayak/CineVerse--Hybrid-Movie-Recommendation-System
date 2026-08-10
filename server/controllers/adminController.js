const User = require('../models/User')
const Movie = require('../models/Movie')

// @desc Get admin dashboard stats
// @route GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const totalMovies = await Movie.countDocuments()
    const totalUsers = await User.countDocuments()
    res.json({ totalMovies, totalUsers })
  } catch (err) {
    next(err)
  }
}

module.exports = { getStats }
