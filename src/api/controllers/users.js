const { query } = require('express')
const { deleteImgCloud } = require('../../utils/deleteImg')
const { generateToken } = require('../../utils/jwt')
const User = require('../models/users')
const bcrypt = require('bcrypt')

const register = async (req, res) => {
  try {
    const { username } = req.body
    const dupliUser = await User.findOne({ username })
    if (dupliUser) {
      return res.status(400).json('Usuario ya existente')
    }
    const user = new User({
      username,
      password: req.body.password,
      email: req.body.email,
      avatar: req.file ? req.file.path : null,
      role: req.body.role || 'user'
    })
    if (req.body.role === 'admin') {
      return res.status(200).json(`Elige rol "user" o rol "company`)
    }
    const savedUser = await user.save()
    return res.status(201).json(savedUser)
  } catch (error) {
    console.log(`Error al registrarse: ${error}`)
    if (req.file && req.file.path) {
      deleteImgCloud(req.file.path)
    }
    return res.status(500).json('Error al registrarse')
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json('Usuario NO encontrado')
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user._id, user.username)
      return res.status(200).json(token)
    } else {
      return res.status(400).json('Usuario o contraseña incorrectos')
    }
  } catch (error) {
    console.log(`Error al hacer login: ${error}`)
    return res.status(500).json('Usuario o contraseña incorrectos')
  }
}
const getUsers = async (req, res) => {
  try {
    const { role } = req.params
    const allUsers = await User.find({ role }).populate('favorites')
    return res.status(200).json(allUsers)
  } catch (error) {
    console.log(`Error al obtener a los usuarios: ${error}`)
    return res.status(500).json('Error al obtener los usuarios')
  }
}
const getUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).populate('favorites')
    if (!user) {
      return res.status(404).json('Usuario NO encontrado')
    }
    return res.status(200).json(user)
  } catch (error) {
    console.log(`Error al obtener el usuario: ${error}`)
    return res.status(400).json('Error al obtener el usuario')
  }
}
const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { password } = req.body
    const actualUser = await User.findById(id)
    if (!actualUser) {
      return res.status(404).json('Usuario NO encontrado')
    }
    const oldPath = actualUser.avatar
    if (req.file && oldPath !== req.file.path) {
      deleteImgCloud(oldPath)
    }
    const newData = {
      username: req.body.username || actualUser.username,
      password: password ? bcrypt.hashSync(password, 10) : actualUser.password,
      email: req.body.email,
      avatar: req.file ? req.file.path : oldPath
    }
    const updatedUser = await User.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true
    })
    return res.status(200).json(updatedUser)
  } catch (error) {
    console.log(`Error al actualizar el usuario: ${error}`)
    if (req.file && req.file.path) {
      deleteImgCloud(req.file.path)
    }
    return res.status(400).json('Error al actualizar el usuario')
  }
}

const addFavEvents = async (req, res) => {
  try {
    const { id } = req.params
    const { favorites } = req.body
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json('Usuario NO encontrado')
    }
    let favList = []
    if (Array.isArray(favorites)) {
      favList = [...user.favorites, ...favorites]
    } else {
      favList = [...user.favorites, favorites]
    }
    const favEvents = await User.findByIdAndUpdate(
      id,
      { $addToSet: { favorites: { $each: favList } } },
      { new: true }
    )
    return res.status(200).json(favEvents)
  } catch (error) {
    console.log(`Error al añadir favoritos: ${error}`)
    return res.status(400).json('Error al añadir a favoritos')
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json('Usuario NO encontrado')
    }
    if (user.avatar) {
      deleteImgCloud(user.avatar)
    }
    await User.findByIdAndDelete(id)
    return res.status(200).json('Usuario eliminado')
  } catch (error) {
    console.log(`Error al eliminar el usuario`)
    return res.status(400).json('Error al eliminar el usuario')
  }
}

module.exports = {
  register,
  login,
  getUsers,
  getUser,
  updateUser,
  addFavEvents,
  deleteUser
}
