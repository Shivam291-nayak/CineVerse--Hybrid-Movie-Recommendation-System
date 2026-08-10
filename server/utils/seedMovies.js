const dotenv = require('dotenv')
const connectDB = require('../config/db')
const Movie = require('../models/Movie')
const movies = require('../data/movies')

dotenv.config()

const importData = async () => {
  try {
    await connectDB()
    await Movie.deleteMany()
    await Movie.insertMany(movies)
    console.log('Movie data imported successfully!')
    process.exit()
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

importData()
