const { isAuth, isAdmin } = require('../../middlewares/auth.middlewares')
const { uploadVenues } = require('../../middlewares/files')
const {
  getVenues,
  postVenue,
  updateVenue,
  getVenue,
  deleteVenue
} = require('../controllers/venues')

const venueRoutes = require('express').Router()
const totalAuth = [isAuth, isAdmin]
venueRoutes.get('/', totalAuth, getVenues)
venueRoutes.get('/:id', totalAuth, getVenue)
venueRoutes.post('/', totalAuth, uploadVenues.single('image'), postVenue)
venueRoutes.put('/:id', totalAuth, uploadVenues.single('image'), updateVenue)
venueRoutes.delete('/:id', totalAuth, deleteVenue)

module.exports = venueRoutes
