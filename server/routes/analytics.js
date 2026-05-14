const express = require('express');
const Analytics = require('../models/Analytics');
const Link = require('../models/Link');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Log page visit (public, no auth needed)
router.post('/visit', async (req, res) => {
  const { userId } = req.body;
  try {
    await Analytics.create({ userId, type: 'visit' });
    res.json({ message: 'Visit logged' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Log link click (public, no auth needed)
router.post('/click', async (req, res) => {
  const { userId, linkId, platform } = req.body;
  try {
    await Analytics.create({ userId, linkId, type: 'click', platform });
    await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } });
    res.json({ message: 'Click logged' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stats for logged in user
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalVisits = await Analytics.countDocuments({ 
      userId, type: 'visit' 
    });
    const totalClicks = await Analytics.countDocuments({ 
      userId, type: 'click' 
    });

    // Clicks per platform
    const platformStats = await Analytics.aggregate([
      { $match: { userId: userId, type: 'click' } },
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);

    // Last 7 days visits
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyVisits = await Analytics.aggregate([
      { $match: { 
        userId: userId, 
        type: 'visit',
        timestamp: { $gte: sevenDaysAgo }
      }},
      { $group: {
        _id: { $dateToString: { 
          format: '%Y-%m-%d', 
          date: '$timestamp' 
        }},
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({ totalVisits, totalClicks, platformStats, dailyVisits });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;