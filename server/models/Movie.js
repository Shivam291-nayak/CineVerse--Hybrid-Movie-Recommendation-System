const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    genre: [{ type: String }],
    description: { type: String },
    poster: { type: String },
    releaseYear: { type: Number },
    rating: { type: Number, default: 0, min: 0, max: 10 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Movie', movieSchema)
