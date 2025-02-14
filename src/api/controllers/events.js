const Event = require('../models/events')
const { deleteImgCloud } = require('../../utils/deleteImg')

const getEvents = async (req, res) => {
  try {
    const { verified } = req.params
    const events = await Event.find({ verified })
    return res.status(200).json(events)
  } catch (error) {
    console.log(`Error al obtener los eventos: ${error}`)
    return res.status(500).json('Error al obtener los eventos')
  }
}
const getEvent = async (req, res) => {
  try {
    const { id } = req.params
    const event = await Event.findById(id).populate('venues')
    if (!event) {
      return res.status(404).json('Evento NO encontrado')
    }
    return res.status(200).json(event)
  } catch (error) {
    console.log(`Error al obtener el evento: ${error}`)
    return res.status(500).json('Error al obtener el evento')
  }
}
const eventsByCategory = async (req, res) => {
  try {
    const category = req.query.category
    const eventsByCategory = await Event.find({ category })
    if (!eventsByCategory) {
      return res.status(404).json(`No se han encontrado eventos en ${category}`)
    }
    return res.status(200).json(eventsByCategory)
  } catch (error) {
    console.log(`Error al obtener los eventos por categoria: ${error}`)
    return res.status(500).json('Error al obtener los eventos por categoria')
  }
}

const eventsByDate = async (req, res) => {
  try {
    const { dateStart, dateEnd } = req.query
    if (!dateStart || !dateEnd) {
      return res.status(400).json('Indica fecha de inicio y fin')
    }
    const start = new Date(dateStart)
    const end = new Date(dateEnd)
    const eventsByDate = await Event.find({
      date: {
        $gte: start.toISOString().split('T')[0],
        $lte: end.toISOString().split('T')[0]
      }
    })
    if (!eventsByDate) {
      return res
        .status(404)
        .json(`No se han encontrado eventos para esas fechas`)
    }
    return res.status(200).json(eventsByDate)
  } catch (error) {
    console.log(`Error al obtener los eventos por fecha: ${error}`)
    return res.status(500).json('Error al obtener los eventos por fecha')
  }
}

const createEvent = async (req, res) => {
  try {
    const { name } = req.body
    const dupliEvent = await Event.findOne({ name })
    if (dupliEvent) {
      return res.status(404).json('Este evento ya existe')
    }
    const newEvent = new Event({
      name,
      image: req.file ? req.file.path : null,
      category: req.body.category,
      price: req.body.price,
      date: req.body.date,
      time: req.body.time,
      company: req.user_id,
      venues: req.body.venues,
      description: req.body.description
    })
    const savedEvent = await newEvent.save()
    return res.status(201).json(savedEvent)
  } catch (error) {
    console.log(`Error al crear el evento: ${error}`)
    if (req.file) {
      deleteImgCloud(req.file.path)
    }
    return res.status(500).json('Error al crear el evento')
  }
}
const verifyEvents = async (req, res) => {
  try {
    const { id } = req.params
    const { verified } = req.body
    const event = await Event.findByIdAndUpdate(id, { verified }, { new: true })
    return res.status(200).json('Evento verificado')
  } catch (error) {
    console.log(`Error al verificar el evento: ${error}`)
    return res.status(500).json('Error al verificar el evento')
  }
}
const verifiedEvents = async (req, res) => {
  try {
    const { verified } = req.params
    const eventsVerified = await Event.find({ verified })
    return res.status(200).json(eventsVerified)
  } catch (error) {
    console.log(`Error al verificar el evento: ${error}`)
    return res.status(500).json('Error al verificar el evento')
  }
}
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const actualEvent = await Event.findById(id)
    if (!actualEvent) {
      return res.status(404).json('Evento NO encontrado')
    }
    const oldPath = actualEvent.image
    if (req.file && oldPath) {
      deleteImgCloud(oldPath)
    }
    const newData = {
      name: req.body.name || actualEvent.name,
      image: req.file ? req.file.path : actualEvent.image,
      category: req.body.category || actualEvent.category,
      price: req.body.price || actualEvent.price,
      date: req.body.date || actualEvent.date,
      time: req.body.time || actualEvent.time,
      venues: req.body.venues || actualEvent.venues,
      description: req.body.description || actualEvent.description
    }
    // let listAssistants = []
    // if (assistants) {
    //   listAssistants = [...actualEvent.assistants, ...assistants]
    // } else {
    //   listAssistants = [...actualEvent.assistants, assistants]
    // }
    const updatedEvent = await Event.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true
    })
    return res.status(200).json(updatedEvent)
  } catch (error) {
    console.log(`Error al actualizar el evento: ${error}`)
    if (req.file && req.file.path) {
      deleteImgCloud(req.file.path)
    }
    return res.status(500).json('Error al actualizar el evento')
  }
}

const updateAssistant = async (req, res) => {
  try {
    const { assistants } = req.user_id
    const { id } = req.param
    const actualEvent = await findById(id)
    if (!actualEvent) {
      return res.status(404).json('Evento NO encontrado')
    }
    let listAssistants = []
    if (assistants) {
      listAssistants = [...actualEvent.assistants, ...assistants]
    } else {
      listAssistants = [...actualEvent.assistants, assistants]
    }
    const addAssistant = await Event.findByIdAndUpdate(
      id,
      { $addToSet: { assistants: { $each: listAssistants } } },
      { new: true }
    )
    return res.status(201).json('Asistente añadido a evento')
  } catch (error) {
    console.log(`Error al añadir el asistente: ${error}`)
    return res.status(500).json('Error al añadir al asistente')
  }
}

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params
    const actualEvent = await Event.findById(id)
    if (!actualEvent) {
      return res.status(404).json('Evento NO encontrado')
    }
    if (actualEvent.image) {
      deleteImgCloud(actualEvent.image)
    }
    await Event.findByIdAndDelete(id)
    return res.status(200).json('Evento eliminado')
  } catch (error) {
    console.log(`Error al eliminar el evento: ${error}`)
    return res.status(500).json('Error al eliminar el evento')
  }
}

module.exports = {
  getEvents,
  getEvent,
  eventsByCategory,
  eventsByDate,
  createEvent,
  verifyEvents,
  verifiedEvents,
  updateEvent,
  updateAssistant,
  deleteEvent
}

// app.post('/api/actividad/bydate', (req, res, next) => {
//   const fechaInicial = req.body.fechaBusqueda; // ejemplo: '2019/03/26'
//   const fechaFinal = fechaInicial.substring(0,8).concat(Number(fechaInicial.substring(8)) + 1);

//   Actividad.find({$and: [{fecha: {$gte: new Date(fechaInicial)}},{fecha: {$lt: new Date(fechaFinal)}}]}, (err, actividad) => {
//       if(err) {
//           console.log(err.message);
//           return res.status(500).json({
//               error: err.message
//           });
//       }
//       if(!actividad) {  // si no se consiguen documentos
//           return res.status(400).json({
//               message: 'No se ha encontrado actividad en la fecha dada.'
//           });
//       }
//       return res.status(200).json(actividad);
//   });
// });
