const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'RYTHM & BLUES',
        'ROCK & ROLL',
        'METAL',
        'DISCO',
        'POP',
        'REGGEATON',
        'FLAMENCO'
      ],
      required: true
    },
    price: { type: Number, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: false },
    company: { type: mongoose.Types.ObjectId, ref: 'users', required: false },
    venues: { type: mongoose.Types.ObjectId, ref: 'venues', required: true },
    description: { type: String, required: false, maxlength: 250 },
    verified: { type: Boolean, default: false },
    assistants: [{ type: mongoose.Types.ObjectId, ref: 'users' }]
  },
  { timestamps: true, collection: 'events' }
)

const Event = mongoose.model('events', eventSchema, 'events')

module.exports = Event
