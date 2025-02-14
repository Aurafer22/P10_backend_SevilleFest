require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db')
const userRoutes = require('./src/api/routes/users')
const eventsRoutes = require('./src/api/routes/events')
const venueRoutes = require('./src/api/routes/venues')
const cloudinary = require('cloudinary').v2
const app = express()
connectDB()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_APY_SECRET
})

app.use(express.json())
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/events', eventsRoutes)
app.use('/api/v1/venues', venueRoutes)

app.use('*', (req, res) => {
  res.status(404).json('Route not found')
})
app.listen(3000, () => {
  console.log('Servidor activo en http://localhost:3000')
})
