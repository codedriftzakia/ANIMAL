import { Request, Response } from 'express';
import User from '../models/User';

// POST /api/users/register
export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, role, organization } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required' });
    }

    // Check if user already registered by email
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update existing user profile details
      user.name = name;
      user.role = role || user.role;
      user.organization = organization !== undefined ? organization : user.organization;
      await user.save();
    } else {
      // Create new registered user
      user = new User({
        name,
        email: email.toLowerCase(),
        role: role || 'Visitor',
        organization: organization || '',
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
