import Admin from '../models/Admin.model.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import LiveAccount from '../models/User.LiveAccount.model.js';
import mongoose from "mongoose";
dotenv.config();

export const registerAdmin = async (req, res) => {
    const { username, password, secretKey } = req.body;

    try {

        const existingAdmin = await Admin.findOne({});
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            secretKey,
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        console.error('Error registering admin:', err.message);
        res.status(500).json({ message: 'Error registering admin', error: err.message });
    }
};


export const loginAdmin = async (req, res) => {
    const { username, password, secretKey } = req.body;

    try {
        if (secretKey) {
            const admin = await Admin.findOne({ secretKey });

            if (admin) {
                const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
                return res.status(200).json({ message: 'Admin logged in successfully', token, username: admin.username });
            } else {
                return res.status(403).json({ message: 'Invalid secret key' });
            }
        }

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Admin logged in successfully', token, username: admin.username });

    } catch (err) {
        console.error('Error logging in:', err.message);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};



//User CRUD Opration.......

// View all users
export const viewAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};



// Create a new user
export const createUser = async (req, res) => {
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

// Update a user by ID
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};


export const getUserWithAccounts = async (userId) => {
    try {
        const user = await User.findById(userId)
            .populate('demoAccount')
            .populate('liveAccount');
        console.log(user);
        return user;
    } catch (err) {
        console.error('Error fetching user with accounts:', err.message);
    }
};


//User Balance CRUD Opration.......


export const getAllLiveAccounts = async (req, res) => {
    try {
      // Fetch all live accounts and populate user details
      const accounts = await LiveAccount.find().populate('user', 'username email');
  
      if (!accounts || accounts.length === 0) {
        return res.status(404).json({ message: 'No live accounts found' });
      }
  
      // Respond with the list of all accounts
      res.status(200).json({ accounts });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching live accounts', error: err.message });
    }
  };
  
  export const getLiveAccountBalanceById = async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from request params

        // Validate if ID exists and is a valid ObjectId
        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid account ID format" });
        }

        // Fetch account and populate user details
        const account = await LiveAccount.findById(id).populate("user", "username email");

        if (!account) {
            return res.status(404).json({ message: "Live account not found" });
        }

        res.status(200).json({ account }); // Return account details
    } catch (err) {
        console.error("Error fetching live account:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};