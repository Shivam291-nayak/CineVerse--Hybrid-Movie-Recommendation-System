
const Rating = require("../models/Rating");

// Calculate cosine similarity between two users
const calculateSimilarity = (ratingsA, ratingsB) => {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  let commonMovies = 0;

  for (const [movieId, ratingA] of ratingsA) {
    if (ratingsB.has(movieId)) {
      const ratingB = ratingsB.get(movieId);

      dotProduct += ratingA * ratingB;
      magnitudeA += ratingA * ratingA;
      magnitudeB += ratingB * ratingB;
      commonMovies++;
    }
  }

  if (commonMovies < 2 || magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

// Get collaborative recommendations
exports.getCollaborativeRecommendations = async (req, res) => {
  try {
    const userId = String(req.user._id);

    const allRatings = await Rating.find().populate(
      "movie",
      "title genre poster release_year"
    );

    if (allRatings.length === 0) {
      return res.status(200).json({
        message: "No ratings available",
        recommendations: [],
      });
    }

    // Build user-movie rating matrix
    const userRatings = new Map();

    for (const item of allRatings) {
      if (!item.movie) continue;

      const currentUserId = String(item.user);
      const movieId = String(item.movie._id);

      if (!userRatings.has(currentUserId)) {
        userRatings.set(currentUserId, new Map());
      }

      userRatings.get(currentUserId).set(movieId, item.rating);
    }

    const targetRatings = userRatings.get(userId);

    if (!targetRatings || targetRatings.size < 2) {
      return res.status(200).json({
        message: "Rate at least two movies to get collaborative recommendations",
        recommendations: [],
      });
    }

    // Find similar users
    const similarUsers = [];

    for (const [otherUserId, otherRatings] of userRatings) {
      if (otherUserId === userId) continue;

      const similarity = calculateSimilarity(
        targetRatings,
        otherRatings
      );

      if (similarity > 0) {
        similarUsers.push({
          userId: otherUserId,
          similarity,
          ratings: otherRatings,
        });
      }
    }

    similarUsers.sort((a, b) => b.similarity - a.similarity);

    // Collect movies rated by similar users but not by target user
    const recommendationsMap = new Map();

    for (const similarUser of similarUsers) {
      for (const [movieId, rating] of similarUser.ratings) {
        if (targetRatings.has(movieId) || rating < 3) continue;

        const existing = recommendationsMap.get(movieId) || {
          movieId,
          scoreTotal: 0,
          similarityTotal: 0,
        };

        existing.scoreTotal += rating * similarUser.similarity;
        existing.similarityTotal += similarUser.similarity;

        recommendationsMap.set(movieId, existing);
      }
    }

    const movieDetails = new Map();

    for (const item of allRatings) {
      if (item.movie) {
        movieDetails.set(String(item.movie._id), item.movie);
      }
    }

    const recommendations = Array.from(recommendationsMap.values())
      .map((item) => ({
        movie: movieDetails.get(item.movieId),
        score: Number(
          (item.scoreTotal / item.similarityTotal).toFixed(2)
        ),
      }))
      .filter((item) => item.movie)
      .sort((a, b) => b.score - a.score);

    return res.status(200).json({
      message: "Collaborative recommendations generated successfully",
      similarUsers: similarUsers.length,
      recommendations,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate collaborative recommendations",
      error: error.message,
    });
  }
};
