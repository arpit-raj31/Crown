import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();


export const register = async (req, res, next) => {
  try {
    const { username, email, password, fullname } = req.body;
    if (!username || !email || !password || !fullname) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] }).lean();
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};


export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).lean(); 
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};



export const validateToken = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Token is valid', user: decoded });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};



export const logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};
