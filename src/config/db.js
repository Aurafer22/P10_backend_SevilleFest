const mongoose = require('mongoose')
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('Conectado a la BBDD 🎯')
  } catch (error) {
    console.log(`Error al conectar con la BBDD: ${error}`)
  }
}

module.exports = { connectDB }
