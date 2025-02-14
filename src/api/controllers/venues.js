const { deleteImgCloud } = require('../../utils/deleteImg')
const Venue = require('../models/venues')

const getVenues = async (req, res) => {
  try {
    const allVenues = await Venue.find()
    return res.status(200).json(allVenues)
  } catch (error) {
    console.log(`Error al obtener los recintos: ${error}`)
    return res.status(400).json('Error al obtener los recintos')
  }
}
const getVenue = async (req, res) => {
  try {
    const { id } = req.params
    const venue = await Venue.findById(id)
    if (!venue) {
      return res.status(404).json('Recinto NO encontrado')
    }
    return res.status(200).json(venue)
  } catch (error) {
    console.log(`Error al obtener el recinto: ${error}`)
    return res.status(400).json('Error al obtener el recinto')
  }
}

const postVenue = async (req, res) => {
  try {
    const { name } = req.body
    const dupliVenue = await Venue.findOne({ name })
    if (dupliVenue) {
      return res.status(200).json('Ya existe un recinto con ese nombre')
    }
    const newVenue = new Venue({
      name: req.body.name,
      address: req.body.address,
      url: req.body.url,
      image: req.file ? req.file.path : null,
      stars: req.body.stars
    })
    const savedVenue = await newVenue.save()
    return res.status(201).json(savedVenue)
  } catch (error) {
    console.log(`Error al crear el recinto: ${error}`)
    if (req.file && req.file.path) {
      deleteImgCloud(req.file.path)
    }
    return res.status(400).json('Error al crear el recinto')
  }
}

const updateVenue = async (req, res) => {
  try {
    const { id } = req.params
    const { name, address, url, stars, events } = req.body
    const actualVenue = await Venue.findById(id)
    if (!actualVenue) {
      return res.status(404).json('Recinto NO encontrado')
    }
    const oldPath = actualVenue.image || null
    if (req.file && oldPath && oldPath !== req.file.path) {
      deleteImgCloud(oldPath)
    }
    const newData = {
      name: name || actualVenue.name,
      address: address || actualVenue.address,
      url: url || actualVenue.url,
      image: req.file ? req.file.path : actualVenue.image,
      stars: stars || actualVenue.stars
    }
    let eventList = actualVenue.events || []
    if (Array.isArray(events) && events.length > 0) {
      eventList = [...eventList, ...events]
    }
    const updatedVenue = await Venue.findByIdAndUpdate(
      id,
      { ...newData, $addToSet: { events: { $each: eventList } } },
      { new: true, runValidators: true }
    )
    return res.status(200).json('Recinto actualizado correctamente')
  } catch (error) {
    console.log(`Error al actualizar el recinto: ${error}`)
    if (req.file) {
      deleteImgCloud(req.file.path)
    }
    return res.status(400).json('Error al actualizar el recinto')
  }
}

const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params
    const actualVenue = await Venue.findById(id)
    if (!actualVenue) {
      return res.status(404).json('Recinto NO encontrado')
    }
    if (actualVenue.image) {
      deleteImgCloud(actualVenue.image)
    }
    await Venue.findByIdAndDelete(id)
    return res.status(200).json('Recinto eliminado')
  } catch (error) {
    console.log(`Error al eliminar el recinto: ${error}`)
    return res.status(400).json('Error al eliminiar el recinto')
  }
}

module.exports = { getVenues, getVenue, postVenue, updateVenue, deleteVenue }
