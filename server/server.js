require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const movieRoutes = require('./routes/movieRoutes')
const watchlistRoutes = require('./routes/watchlistRoutes')
const adminRoutes = require('./routes/adminRoutes')
const ratingRoutes = require('./routes/ratingRoutes')
const collaborativeRoutes = require("./routes/collaborativeRoutes");
const hybridRoutes = require("./routes/hybridRoutes");
const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hybrid Movie Recommendation API Running Successfully',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/watchlist', watchlistRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/ratings', ratingRoutes)
app.use("/api/collaborative", collaborativeRoutes);
app.use("/api/hybrid", hybridRoutes);
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`)
})