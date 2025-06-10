const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  
  streak: {
    type: Number,
    default: 0
  },
  frequency:
  {
    type: String,
    required: true
  },
  
  completed: {
    type: Boolean,
    default: false
  },
  userEmail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);