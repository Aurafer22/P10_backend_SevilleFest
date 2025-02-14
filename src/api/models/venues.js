const mongoose = require('mongoose')

const venuesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    url: { type: String, required: false, trim: true },
    image: { type: String, required: false },
    stars: { type: Number, max: 5 },
    events: [{ type: mongoose.Types.ObjectId, ref: 'events' }]
  },
  {
    timestamps: true,
    collection: 'venues'
  }
)

const Venue = mongoose.model('venues', venuesSchema, 'venues')

module.exports = Venue
