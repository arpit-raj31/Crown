// Import models
import User from '../models/User.js';
import UserDemoAccount from '../models/User.DemoAccount.js';
import UserDemoTransaction from '../models/User.DemoTransaction.js';
import UserLiveAccount from '../models/User.LiveAccount.model.js';
import UserLiveAccTransactions from '../models/User.LiveAccTransactions.js';
import UserTradesModal from '../models/UserTrades.Modal.js';

// Generic helper for error handling
const handleError = (res, error, message) => {
    console.error(`${message}:`, error.message || error);
    res.status(500).json({ success: false, message: `${message}. Error: ${error.message || error}` });
};

// CRUD for Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        handleError(res, error, 'Failed to fetch users');
    }
};

export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        handleError(res, error, 'Failed to create user');
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        handleError(res, error, 'Failed to update user');
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Failed to delete user');
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        handleError(res, error, 'Failed to fetch user by ID');
    }
};

// CRUD Factory for other models
const createCRUDRoutes = (Model, name) => ({
    getAll: async (req, res) => {
        try {
            const items = await Model.find();
            res.status(200).json({ success: true, data: items });
        } catch (error) {
            handleError(res, error, `Failed to fetch ${name}`);
        }
    },
    create: async (req, res) => {
        try {
            const item = await Model.create(req.body);
            res.status(201).json({ success: true, data: item });
        } catch (error) {
            handleError(res, error, `Failed to create ${name}`);
        }
    },
    update: async (req, res) => {
        try {
            const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!item) return res.status(404).json({ success: false, message: `${name} not found` });
            res.status(200).json({ success: true, data: item });
        } catch (error) {
            handleError(res, error, `Failed to update ${name}`);
        }
    },
    delete: async (req, res) => {
        try {
            const item = await Model.findByIdAndDelete(req.params.id);
            if (!item) return res.status(404).json({ success: false, message: `${name} not found` });
            res.status(200).json({ success: true, message: `${name} deleted successfully` });
        } catch (error) {
            handleError(res, error, `Failed to delete ${name}`);
        }
    },
    getById: async (req, res) => {
        try {
            const item = await Model.findById(req.params.id);
            if (!item) return res.status(404).json({ success: false, message: `${name} not found` });
            res.status(200).json({ success: true, data: item });
        } catch (error) {
            handleError(res, error, `Failed to fetch ${name} by ID`);
        }
    },
});



// Generate CRUD operations for all models
export const demoAccountCRUD = createCRUDRoutes(UserDemoAccount, 'Demo Account');
export const demoTransactionCRUD = createCRUDRoutes(UserDemoTransaction, 'Demo Transaction');
export const liveAccountCRUD = createCRUDRoutes(UserLiveAccount, 'Live Account');
export const liveTransactionCRUD = createCRUDRoutes(UserLiveAccTransactions, 'Live Transaction');
export const tradesCRUD = createCRUDRoutes(UserTradesModal, 'Trade');