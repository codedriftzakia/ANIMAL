import { Request, Response } from 'express';
import User from '../models/User';

// POST /api/users/register
export async function registerUser(req: Request, res: Response) {
  try {
    const { name, role } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const trimmedName = name.trim();
    let user = await User.findOne({ name: { $regex: `^${trimmedName}$`, $options: 'i' } });

    if (user) {
      // Update existing user role
      user.role = role || user.role;
      await user.save();
    } else {
      // Create new user profile
      user = new User({
        name: trimmedName,
        role: role || 'Visitor',
      });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// GET /api/users
export async function getUsers(req: Request, res: Response) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
