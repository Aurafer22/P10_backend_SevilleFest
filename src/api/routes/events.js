const {
  isAdmin,
  isAuth,
  isCompany
} = require('../../middlewares/auth.middlewares')
const { uploadEvents } = require('../../middlewares/files')
const {
  getEvents,
  eventsByDate,
  createEvent,
  verifiedEvents,
  updateEvent,
  updateAssistant,
  deleteEvent,
  eventsByCategory,
  verifyEvents,
  getEvent
} = require('../controllers/events')

const eventsRoutes = require('express').Router()

eventsRoutes.get('/admin/:verified', [isAuth, isAdmin], getEvents) //eventos sin verificar. OK
eventsRoutes.get('/all_events/:verified', verifiedEvents) //todo el mundo. Sin login. Eventos ya verificados. OK
eventsRoutes.get('/eventSelected/:id', getEvent) //ver detalle de un evento. OK
eventsRoutes.get('/category', eventsByCategory) //sin login. OK
eventsRoutes.get(`/eventsByDate`, eventsByDate) //sin login. OK
eventsRoutes.post(
  '/company',
  isAuth,
  isCompany,
  uploadEvents.single('image'),
  createEvent
) //company crea el evento y admin tiene que verificar. OK
eventsRoutes.put('/admin/:id', [isAuth, isAdmin], verifyEvents) //admin verifica el evento y se va a getEvents. OK
eventsRoutes.put(
  '/company/:id',
  isAuth,
  isCompany,
  uploadEvents.single('image'),
  updateEvent
) //modificacion de algunos elementos del evento. OK
eventsRoutes.put('/:id', isAuth, updateAssistant) //usuario clica en "asistir" y modifica este campo
eventsRoutes.delete('/:id', isAuth, isCompany, deleteEvent) //company y admin pueden eliminar un evento. OK

module.exports = eventsRoutes
