
require('dotenv').config({
  path: require('path').join(__dirname, '../.env'),
})

const connectDB = require('../config/db')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

async function createAdmin() {
  try {
    await connectDB()

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required in server/.env')
    }

    let user = await User.findOne({ email })

    if (!user) {
      user = new User({
        name: 'CineVerse Administrator',
        email,
        password,
        role: 'admin',
      })
    } else {
      user.role = 'admin'
user.set('password', password)
user.markModified('password')
    }

    await user.save()

    // Read the account back from MongoDB.
    const savedUser = await User.findOne({ email }).select('+password')

    console.log('Admin found:', Boolean(savedUser))
    console.log('Admin role:', savedUser?.role)
    console.log(
      'Stored password has bcrypt format:',
      /^\$2[aby]\$/.test(savedUser?.password || '')
    )
    console.log(
      'Password verification:',
      savedUser ? await bcrypt.compare(password, savedUser.password) : false
    )

    if (!savedUser || !(await bcrypt.compare(password, savedUser.password))) {
      throw new Error(
        'Password verification failed. Check for another password hashing hook.'
      )
    }

    console.log('Admin password verified successfully.')
  } catch (error) {
    console.error('Admin setup failed:', error.message)
    process.exitCode = 1
  } finally {
    // Close the database connection after verification.
    const mongoose = require('mongoose')
    await mongoose.disconnect()
  }
}

createAdmin()
