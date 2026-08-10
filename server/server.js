const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const errorMiddleware = require('./middleware/errorMiddleware')

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const movieRoutes = require('./routes/movieRoutes')
const watchlistRoutes = require('./routes/watchlistRoutes')

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/watchlist', watchlistRoutes)

app.get('/', (req, res) => {
  res.send('Movie Recommendation System API is running')
})

app.use(errorMiddleware)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
