require('dotenv').config({ path: require('path').join(__dirname, '../.env') })

const connectDB = require('../config/db')
const mongoose = require('mongoose')
const Movie = require('../models/Movie')
const movies = require('../data/movies')

const importData = async () => {
  try {
    console.log(`Movies found in seed file: ${movies.length}`)

    if (!movies.length) {
      throw new Error('No movies found in server/data/movies.js')
    }

    await connectDB()

    await Movie.deleteMany({})
    const insertedMovies = await Movie.insertMany(movies)

    console.log(`Successfully imported ${insertedMovies.length} movies.`)
  } catch (err) {
    console.error('Movie import failed:')
    console.error(err)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

importData()
