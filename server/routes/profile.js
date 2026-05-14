const express = require('express')
const User = require('../models/User')
const protect = require('../middleware/authMiddleware')
const { upload } = require('../utils/cloudinary')
const router = express.Router()

// Get public profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    }).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update profile
router.put('/update', protect, async (req, res) => {
  const { bio, theme, socialLinks } = req.body
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio, theme, socialLinks },
      { new: true }
    ).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Upload profile photo
router.post('/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { photo: req.file.path },
      { new: true }
    ).select('-password')
    res.json({ photo: user.photo })
  } catch (err) {
    res.status(500).json({ message: 'Photo upload failed' })
  }
})

module.exports = router