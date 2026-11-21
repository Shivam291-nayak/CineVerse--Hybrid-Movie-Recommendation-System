const User = require('../models/User')
const Movie = require('../models/Movie')
const Watchlist = require('../models/Watchlist')
const generateToken = require('../utils/generateToken')

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid admin credentials',
      })
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin account required.',
      })
    }

    const passwordMatches =
      await user.matchPassword(password)

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid admin credentials',
      })
    }

    res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token: generateToken(user._id),
    })
  } catch (error) {
    next(error)
  }
}

const getStats = async (req, res, next) => {
  try {
    const [
      totalMovies,
      totalUsers,
      totalWatchlists,
    ] = await Promise.all([
      Movie.countDocuments(),
      User.countDocuments(),
      Watchlist.countDocuments(),
    ])

    res.status(200).json({
      totalMovies,
      totalUsers,
      totalWatchlists,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  loginAdmin,
  getStats,
}