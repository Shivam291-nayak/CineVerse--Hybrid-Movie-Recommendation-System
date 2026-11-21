const Rating = require("../models/Rating");
const Movie = require("../models/Movie");

// Add or update a movie rating
exports.rateMovie = async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const userId = req.user._id;

    if (!movieId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Please provide a valid movie ID and rating (1-5)",
      });
    }

    const movieExists = await Movie.findById(movieId);

    if (!movieExists) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const savedRating = await Rating.findOneAndUpdate(
      { user: userId, movie: movieId },
      { rating },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      message: "Rating saved successfully",
      rating: savedRating,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save rating",
      error: error.message,
    });
  }
};

// Get ratings of the logged-in user
exports.getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id })
      .populate("movie", "title poster genre");

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};