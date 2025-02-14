const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

function configUploadImg(folder) {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `proyecto_10/${folder}`,
      allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
    }
  })
}

const uploadUsers = multer({ storage: configUploadImg('users') })
const uploadEvents = multer({ storage: configUploadImg('events') })
const uploadVenues = multer({ storage: configUploadImg('venues') })

module.exports = { uploadUsers, uploadEvents, uploadVenues }
