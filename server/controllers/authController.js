const User = require('../models/User')
const generateToken = require('../utils/generateToken')

// POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const name = req.body.name?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      })
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists. Please log in.',
      })
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registerUser,
  loginUser,
}
