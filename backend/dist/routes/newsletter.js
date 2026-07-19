import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { protect, authorize } from '../middleware/auth.js';
import { sendEmail } from '../utils/sendEmail.js';
const router = express.Router();

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const {
      email
    } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    const existing = await Newsletter.findOne({
      email: email.toLowerCase()
    });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.status(200).json({
          success: true,
          message: 'Subscription reactivated'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed'
      });
    }
    await Newsletter.create({
      email
    });

    // Fire-and-forget: send welcome email
    sendEmail({
      email,
      subject: 'Welcome to the LearnKins Newsletter!',
      message: `
        Welcome to the LearnKins Newsletter!

        Thank you for subscribing. You'll receive updates on:
        - New features and content
        - Study tips and resources
        - Platform announcements

        If you no longer wish to receive these emails, you can unsubscribe at any time.

        Best regards,
        The LearnKins Team
      `
    }).catch(err => console.error('Newsletter welcome email failed:', err.message));
    res.status(201).json({
      success: true,
      message: 'Subscribed successfully'
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all subscribers (admin)
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
router.get('/subscribers', protect, authorize('admin'), async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({
      subscribedAt: -1
    });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Send newsletter to all active subscribers (admin)
// @route   POST /api/newsletter/send
// @access  Private/Admin
router.post('/send', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      subject,
      message
    } = req.body;
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }
    const subscribers = await Newsletter.find({
      active: true
    });
    if (subscribers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active subscribers'
      });
    }

    // Sanitize subject to prevent header injection
    const safeSubject = subject.replace(/[\r\n]/g, ' ').trim();
    let sent = 0;
    let failed = 0;

    // Send to all subscribers (fire-and-forget each, but track results)
    const results = await Promise.allSettled(subscribers.map(sub => sendEmail({
      email: sub.email,
      subject: safeSubject,
      message
    })));
    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value) sent++;else failed++;
    });
    res.status(200).json({
      success: true,
      message: `Newsletter sent. ${sent} delivered, ${failed} failed.`,
      data: {
        total: subscribers.length,
        sent,
        failed
      }
    });
  } catch (error) {
    console.error('Send newsletter error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Unsubscribe
// @route   PUT /api/newsletter/unsubscribe
// @access  Public
router.put('/unsubscribe', async (req, res) => {
  try {
    const {
      email
    } = req.body;
    await Newsletter.findOneAndUpdate({
      email: email.toLowerCase()
    }, {
      active: false
    });
    res.status(200).json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
export default router;