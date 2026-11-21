const express = require("express");
const router = express.Router();

const {
  rateMovie,
  getMyRatings,
} = require("../controllers/ratingController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, rateMovie);
router.get("/my-ratings", protect, getMyRatings);

module.exports = router;