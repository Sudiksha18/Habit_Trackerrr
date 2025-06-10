const mongoose = require('mongoose');

// Define the schema
const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'signup',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Cardio', 'Strength', 'Flexibility', 'Yoga', 'HIIT', 'Dance', 'Swimming', 'Cycling', 'Running', 'Walking', 'Other']
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  notes: {
    type: String,
    default: ''
  }
}, { 
  collection: 'workouts',
  timestamps: true 
});

// Create a compound index to ensure one workout per user per day
workoutSchema.index({ userId: 1, date: 1 }, { unique: true });

// Add pre-save middleware to log workout creation
workoutSchema.pre('save', function(next) {
  console.log('Saving workout:', this);
  next();
});

// Create the model with explicit collection name
const Workout = mongoose.model('Workout', workoutSchema, 'workouts');

// Create indexes
Workout.createIndexes();

// Log when the model is created
console.log('Workout model created with schema:', workoutSchema);

// Add a method to check if a workout exists for a date
workoutSchema.statics.findByUserAndDate = async function(userId, date) {
  return this.findOne({
    userId,
    date: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999))
    }
  });
};

module.exports = Workout; 