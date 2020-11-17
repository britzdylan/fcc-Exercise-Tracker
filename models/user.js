const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
  username: {
      type: String,
      required: true,
      unique: true
  },
  exercises : [{
    description : String,
    duration : Number,
    date : Date
  }]
})


module.exports = mongoose.model('User', userSchema)