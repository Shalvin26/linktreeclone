const express = require('express');
const Link = require('../models/Link');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Get all links
router.get('/', protect, async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user.id })
                            .sort({ order: 1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add link
router.post('/', protect, async (req, res) => {
  const { title, url, icon } = req.body;
  try {
    const count = await Link.countDocuments({ userId: req.user.id });
    const link = await Link.create({
      userId: req.user.id,
      title, url, icon,
      order: count
    });
    res.status(201).json(link);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit link
router.put('/:id', protect, async (req, res) => {
  try {
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete link
router.delete('/:id', protect, async (req, res) => {
  try {
    await Link.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    res.json({ message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reorder links
router.put('/reorder/update', protect, async (req, res) => {
  const { links } = req.body; // array of { id, order }
  try {
    for (let link of links) {
      await Link.findByIdAndUpdate(link.id, { order: link.order });
    }
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get links by username (public)
router.get('/public/:username', async (req, res) => {
  try {
    const User = require('../models/User')
    const user = await User.findOne({ username: req.params.username })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const links = await Link.find({ 
      userId: user._id, 
      isActive: true 
    }).sort({ order: 1 })

    res.json(links)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})


module.exports = router;