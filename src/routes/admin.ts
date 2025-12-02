import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import Shortcut from '../models/Shortcut';
import Settings from '../models/Settings';
import { adminAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalShortcuts = await Shortcut.countDocuments();
    const totalClicks = await Shortcut.aggregate([
      { $group: { _id: null, total: { $sum: '$clicks' } } }
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const topShortcuts = await Shortcut.find()
      .sort({ clicks: -1 })
      .limit(10)
      .populate('userId', 'username email');

    res.json({
      stats: {
        totalUsers,
        totalShortcuts,
        totalClicks: totalClicks[0]?.total || 0
      },
      recentUsers,
      topShortcuts
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user information
router.put('/users/:id', adminAuth, [
  body('username').optional().trim().notEmpty().withMessage('Username cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username is already taken (if username is being changed)
    if (req.body.username && req.body.username !== user.username) {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    // Check if email is already taken (if email is being changed)
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update user fields
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.role) user.role = req.body.role;

    await user.save();

    res.json({ 
      message: 'User updated successfully', 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', adminAuth, [
  body('role').isIn(['user', 'admin']).withMessage('Invalid role')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = req.body.role;
    await user.save();

    res.json({ message: 'User role updated successfully', user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }});
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Delete all user's shortcuts
    await Shortcut.deleteMany({ userId: user._id });
    
    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all shortcuts
router.get('/shortcuts', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const shortcuts = await Shortcut.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json({ shortcuts });
  } catch (error) {
    console.error('Get shortcuts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete shortcut (admin)
router.delete('/shortcuts/:id', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const shortcut = await Shortcut.findByIdAndDelete(req.params.id);
    if (!shortcut) {
      return res.status(404).json({ message: 'Shortcut not found' });
    }

    res.json({ message: 'Shortcut deleted successfully' });
  } catch (error) {
    console.error('Delete shortcut error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get site settings
router.get('/settings', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update site settings
router.put('/settings', adminAuth, [
  body('siteTitle').optional().trim().notEmpty().withMessage('Site title cannot be empty'),
  body('siteIcon').optional().trim(),
  body('siteLogo').optional().trim(),
  body('seoDescription').optional().trim(),
  body('seoKeywords').optional().trim()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const { siteTitle, siteIcon, siteLogo, seoDescription, seoKeywords } = req.body;

    if (siteTitle !== undefined) settings.siteTitle = siteTitle;
    if (siteIcon !== undefined) settings.siteIcon = siteIcon;
    if (siteLogo !== undefined) settings.siteLogo = siteLogo;
    if (seoDescription !== undefined) settings.seoDescription = seoDescription;
    if (seoKeywords !== undefined) settings.seoKeywords = seoKeywords;
    settings.updatedAt = new Date();

    await settings.save();

    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
