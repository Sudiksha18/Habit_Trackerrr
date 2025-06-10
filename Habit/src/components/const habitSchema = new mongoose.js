const habitSchema = new mongoose.Schema({
  text: String,
  description: String,
  category: String,
  streak: Number,
  completed: Boolean,
  userEmail: String // Connects habits to users
});