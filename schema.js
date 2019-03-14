const mongoose = require('mongoose')

// Define collection and schema for todo item
const todo = new mongoose.Schema({
  todo: {
    type: String
  },

  done: {
    type: Boolean
  }
},

  {
    collection: 'todos'
  }
)

module.exports = mongoose.model('Todo', todo)
