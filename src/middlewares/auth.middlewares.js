const User = require('../api/models/users')
const { verifyToken } = require('../utils/jwt')
const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(404).json('Token NO encontrado')
  }
  try {
    const { id } = verifyToken(token, process.env.SECRET_KEY)
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json('Usuario NO encontrado')
    }
    req.user = user
    next()
  } catch (error) {
    console.log(`Error al autorizar el acceso: ${error}`)
    return res.status(500).json('Acceso NO AUTORIZADO')
  }
}
const isOwner = async (req, res, next) => {
  const user = req.user
  try {
    const paramId = req.params
    const paramIdString = paramId.toString()
    if (
      paramIdString === user._id ||
      user._id === paramId.company ||
      user.role === 'admin'
    ) {
      req.user = user
      next()
    }
  } catch (error) {
    console.log(`Error al autorizar como Propietario: ${error}`)
    return res.status(400).json('Acceso NO AUTORIZADO')
  }
}
const isCompany = async (req, res, next) => {
  const user = req.user
  try {
    if (user.role === 'company') {
      req.user = user
      next()
    }
  } catch (error) {
    console.log(`Error al autorizar como Company: ${error}`)
    return res.status(500).json('Acceso NO AUTORIZADO')
  }
}

const isAdmin = async (req, res, next) => {
  const user = req.user
  try {
    if (user.role === 'admin') {
      req.user = user
      next()
    }
  } catch (error) {
    console.log(`Error al autorizar como Admin: ${error}`)
    return res.status(400).json('Acceso NO AUTORIZADO')
  }
}

module.exports = { isAuth, isOwner, isCompany, isAdmin }
