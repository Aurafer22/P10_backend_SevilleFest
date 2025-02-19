const {
  isAuth,
  isAdmin,
  isOwner
} = require('../../middlewares/auth.middlewares')
const { uploadUsers } = require('../../middlewares/files')
const {
  register,
  login,
  updateUser,
  addFavEvents,
  deleteUser,
  getUser,
  getUsers
} = require('../controllers/users')

const userRoutes = require('express').Router()
const totalAuth = [isAuth, isOwner]
userRoutes.post('/register', uploadUsers.single('avatar'), register)
userRoutes.post('/login', login)
userRoutes.get('/:role', [isAuth, isAdmin], getUsers)
userRoutes.get('/perfil/:id', totalAuth, getUser)
userRoutes.put(
  '/perfil/:id',
  totalAuth,
  uploadUsers.single('avatar'),
  updateUser
)
userRoutes.put('/:id', totalAuth, addFavEvents)
userRoutes.delete('/:id', totalAuth, deleteUser)

module.exports = userRoutes
