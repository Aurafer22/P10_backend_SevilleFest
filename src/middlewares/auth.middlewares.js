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
    return res.status(500).json('Acceso NO AUTORIZADO. No estás registrado')
  }
}
const isOwner = async (req, res, next) => {
  const user = req.user
  try {
    const paramId = req.params.id
    const userID = user._id
    const userIdString = userID.toString()
    // const paramIdString = paramId.toString()
    console.log(typeof paramId)

    console.log(`paramID: ${paramId}`)

    // console.log(paramIdString)
    console.log(typeof user._id)

    console.log(`user.id: ${user._id}`)

    if (
      paramId === userIdString ||
      userIdString === paramId.company ||
      user.role === 'admin'
    ) {
      req.user = user
      next()
    } else {
      return res.status(400).json('Acceso NO AUTORIZADO. No eres propietario')
    }
  } catch (error) {
    console.log(`Error al autorizar como Propietario: ${error}`)
    return res.status(400).json('Acceso NO AUTORIZADO. No eres propietario')
  }
}
const isCompany = async (req, res, next) => {
  const user = req.user
  try {
    if (user.role === 'company' || user.role === 'admin') {
      req.user = user
      next()
    } else {
      return res.status(500).json('Acceso NO AUTORIZADO. No eres empresa')
    }
  } catch (error) {
    console.log(`Error al autorizar como Company: ${error}`)
    return res.status(500).json('Acceso NO AUTORIZADO. No eres empresa')
  }
}

const isAdmin = async (req, res, next) => {
  const user = req.user
  try {
    if (user.role === 'admin') {
      req.user = user
      next()
    } else {
      return res.status(400).json('Acceso NO AUTORIZADO. No eres administrador')
    }
  } catch (error) {
    console.log(`Error al autorizar como Admin: ${error}`)
    return res.status(400).json('Acceso NO AUTORIZADO. No eres administrador')
  }
}

module.exports = { isAuth, isOwner, isCompany, isAdmin }
