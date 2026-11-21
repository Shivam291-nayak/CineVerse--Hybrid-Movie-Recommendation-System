const express = require('express')

const {
  loginAdmin,
  getStats,
} = require('../controllers/adminController')

const protect = require('../middleware/authMiddleware')
const admin = require('../middleware/adminMiddleware')

const router = express.Router()

router.post('/login', loginAdmin)

router.get(
  '/stats',
  protect,
  admin,
  getStats
)

module.exports = router