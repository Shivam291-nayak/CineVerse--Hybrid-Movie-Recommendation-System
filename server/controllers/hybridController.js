
const axios = require("axios");
const Rating = require("../models/Rating");
const Movie = require("../models/Movie");

exports.getHybridRecommendations = async (req, res) => {
  try {
    const userId = String(req.user._id);

    const ratings = await Rating.find().populate("movie");

    const userRatings = new Map();
    const movieMap = new Map();

    ratings.forEach((r) => {
      if (!r.movie) return;

      const uid = String(r.user);
      const mid = String(r.movie._id);

      if (!userRatings.has(uid)) userRatings.set(uid, new Map());

      userRatings.get(uid).set(mid, r.rating);
      movieMap.set(mid, r.movie);
    });

    const myRatings = userRatings.get(userId);

    if (!myRatings || myRatings.size < 2) {
      return res.json({ recommendations: [] });
    }

    // 1. Collaborative filtering
    const scores = new Map();

    for (const [otherId, otherRatings] of userRatings) {
      if (otherId === userId) continue;

      const common = [...myRatings.keys()].filter((id) =>
        otherRatings.has(id)
      );

      if (common.length < 2) continue;

      let dot = 0, a = 0, b = 0;

      common.forEach((id) => {
        const x = myRatings.get(id);
        const y = otherRatings.get(id);

        dot += x * y;
        a += x * x;
        b += y * y;
      });

      const similarity = dot / (Math.sqrt(a) * Math.sqrt(b));

      if (!similarity) continue;

      for (const [movieId, rating] of otherRatings) {
        if (myRatings.has(movieId) || rating < 3) continue;

        const old = scores.get(movieId) || { total: 0, weight: 0 };

        old.total += rating * similarity;
        old.weight += similarity;

        scores.set(movieId, old);
      }
    }

    // 2. Get content-based recommendations from Python ML service
    const likedMovies = [];

    for (const [movieId, rating] of myRatings) {
      if (rating >= 4) {
        const movie = movieMap.get(movieId);
        if (movie) likedMovies.push(movie);
      }
    }

    const contentScores = new Map();

    for (const likedMovie of likedMovies) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5001/recommend",
          {
            title: likedMovie.title,
            limit: 20,
          },
          { timeout: 15000 }
        );

        for (const item of response.data.recommendations || []) {
          const key = item.title.trim().toLowerCase();
          const old = contentScores.get(key) || {
            total: 0,
            count: 0,
          };

          old.total += Number(item.similarity);
          old.count += 1;

          contentScores.set(key, old);
        }
      } catch (mlError) {
        console.error(
          `Python ML recommendation failed for ${likedMovie.title}:`,
          mlError.message
        );
      }
    }

    // 3. Combine collaborative and content-based scores
    const recommendations = [];
    const candidateIds = new Set([
      ...scores.keys(),
    ]);

    for (const movie of await Movie.find({}, "title")) {
      const key = movie.title.trim().toLowerCase();

      if (contentScores.has(key)) {
        candidateIds.add(String(movie._id));
      }
    }

    for (const movieId of candidateIds) {
      if (myRatings.has(movieId)) continue;

      const movie = movieMap.get(movieId) ||
        await Movie.findById(movieId);

      if (!movie) continue;

      const key = movie.title.trim().toLowerCase();

      const collaborativeData = scores.get(movieId);

      const collaborativeScore = collaborativeData &&
        collaborativeData.weight > 0
        ? collaborativeData.total / collaborativeData.weight
        : 0;

      const contentData = contentScores.get(key);

      const contentScore = contentData
        ? (contentData.total / contentData.count) * 5
        : 0;

      const hybridScore =
        0.7 * collaborativeScore + 0.3 * contentScore;

      recommendations.push({
        movie,
        collaborativeScore: Number(collaborativeScore.toFixed(2)),
        contentScore: Number(contentScore.toFixed(2)),
        hybridScore: Number(hybridScore.toFixed(2)),
      });
    }

    recommendations.sort((a, b) => b.hybridScore - a.hybridScore);

    return res.json({
      message: "Hybrid recommendations generated successfully",
      contentModel: "Python TF-IDF + Cosine Similarity",
      collaborativeModel: "User-based Collaborative Filtering",
      recommendations: recommendations.slice(0, 10),
    });

  } catch (error) {
    console.error("Hybrid recommendation error:", error);

    res.status(500).json({
      message: "Hybrid recommendation failed",
      error: error.message,
    });
  }
};
