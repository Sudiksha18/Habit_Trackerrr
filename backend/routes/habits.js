const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');
console.log("habit.js")
// router.get('/habits', auth, async (req, res) => {
//   try {
//     const habits = await Habit.find({ userId: req.user.id });
//     console.log("get habits",habits)
//     res.json(habits);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching habits' });
//   }
// });
router.get('/byEmail', async (req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const habits = await Habit.find({ userEmail: userEmail.toLowerCase() });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching habits by email' });
  }
});


router.post('/habits', auth, async (req, res) => {

  try {
    const habit = new Habit({
      ...req.body,
      userId: req.user.id
    });
    await console.log("hii",JSON.stringify(req.body))
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ message: 'Error creating habit' });
  }
});


router.patch('/:id/toggle', async (req, res) => {
  try {
    console.log("toggle habit")
    const habitId = req.params.id;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    // Find the habit by ID and userEmail (optional for extra security)
    const habit = await Habit.findOne({ _id: habitId, userEmail: userEmail });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Toggle the completed status
    habit.completed = !habit.completed;

    await habit.save();

    res.json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find();
    console.log("get habits",habits)
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const habit = new Habit(req.body);
  try {
    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;