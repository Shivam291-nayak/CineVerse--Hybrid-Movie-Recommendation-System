
const express = require("express");
const router = express.Router();

const {
  getCollaborativeRecommendations,
} = require("../controllers/collaborativeController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getCollaborativeRecommendations);

module.exports = router;
