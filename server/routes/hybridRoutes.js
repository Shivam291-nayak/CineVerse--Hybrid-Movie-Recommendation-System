
const express = require("express");
const router = express.Router();

const {
  getHybridRecommendations,
} = require("../controllers/hybridController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getHybridRecommendations);

module.exports = router;
