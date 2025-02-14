const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      match: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, 'Mínimo 8 caracteres']
    },
    avatar: { type: String, required: false },
    role: { type: String, enum: ['admin', 'user', 'company'], required: true },
    favorites: [{ type: mongoose.Types.ObjectId, ref: 'events' }]
  },
  {
    timestamps: true,
    collection: 'users'
  }
)
userSchema.pre('save', function (next) {
  if (this.role === 'admin' && !this.isAdmin) {
    this.role = 'user'
  }
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, 10)
  }
  next()
})

// userSchema.pre('save', function (next) {
//   if (this.role === 'admin' && !this.isAdmin) {
//     this.role = 'user'
//   }
//   if (this.isModified('password')) {
//     const validation = /^(?=.*[A-Za-z])(?=.*\d)[\w-.]{8,}$/
//     if (!validation.test(this.password)) {
//       return next(new Error('Mínimo 8 caracteres'))
//     }
//     this.password = bcrypt.hashSync(this.password, 10)
//   }
//   next()
// })

// userSchema.pre('findOneAndUpdate', function (next) {
//   const update = this.getUpdate()
//   if (!update.password) {
//     next()
//   }
//   if (update.password) {
//     const validation = /^(?=.*[A-Za-z])(?=.*\d)[\w-.]{8,}$/
//     if (!validation.test(update.password)) {
//       return next(new Error('Mínimo 8 caracteres'))
//     }
//     update.password = bcrypt.hashSync(update.password, 10)
//     this.setUpdate(update)
//   }
//   next()
// })

const User = mongoose.model('users', userSchema, 'users')

module.exports = User
