const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('recentActivities');
    
    res.json({
      name: user.name,
      email: user.email,
      recentActivities: user.recentActivities,
      joinedDate: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

module.exports = router;