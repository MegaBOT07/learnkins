import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.status(200).json({ success: true, message: 'Subscription reactivated' });
      }
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }

    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get all subscribers (admin)
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
router.get('/subscribers', protect, authorize('admin'), async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Unsubscribe
// @route   PUT /api/newsletter/unsubscribe
// @access  Public
router.put('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    await Newsletter.findOneAndUpdate({ email: email.toLowerCase() }, { active: false });
    res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
