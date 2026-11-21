
const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: [{ type: String, trim: true }],
    description: { type: String, default: '' },
    poster: { type: String, default: '' },
    backdrop: { type: String, default: '' },
    releaseYear: { type: Number, min: 1888, max: 2100 },
    // Keep "rating" for compatibility with existing pages/data.
    rating: { type: Number, default: 0, min: 0, max: 10 },
    imdbId: { type: String, default: '' },
    imdbRating: { type: Number, default: null, min: 0, max: 10 },
    trailerUrl: { type: String, default: '' },
    duration: { type: String, default: '' },
    language: { type: String, default: '' },
    director: { type: String, default: '' },
    cast: [{ type: String, trim: true }],
    userRating: { type: Number, default: 0, min: 0, max: 10 },
    ratingCount: { type: Number, default: 0, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Movie', movieSchema)
