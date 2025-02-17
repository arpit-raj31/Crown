import express from 'express';
import { 
  registerAdmin, 
  loginAdmin, 
  viewAllUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserWithAccounts, 
  getAllLiveAccounts,
  getLiveAccountBalanceById, 
  
} from '../../controllers/adminController.js';
import { authenticateAdmin, secretKeyMiddleware } from '../../middleware/auth/adminAuth.js';
import { 
  createLiveAccount, 
  deposit, 
  updateBalance, 
  withdraw 
} from './../../controllers/accountController.js';
import { 
  getAllUsers, 
  createUser as createDataUser, 
  updateUser as updateDataUser, 
  deleteUser as deleteDataUser, 
  getUserById, 
  demoAccountCRUD, 
  demoTransactionCRUD, 
  liveAccountCRUD, 
  liveTransactionCRUD, 
  tradesCRUD 
} from '../../controllers/adminDataController.js';

const router = express.Router();

// Admin Auth Routes
router.post('/register', registerAdmin);
router.post('/login', secretKeyMiddleware, loginAdmin);

// Admin Routes for Users
// router.get('/users', authenticateAdmin, getAllUsers); // Get all users
router.post('/users', authenticateAdmin, createUser); // Create a new user
// router.put('/users/:id', authenticateAdmin, updateDataUser); // Update a user by ID
// router.delete('/users/:id', authenticateAdmin, deleteDataUser); // Delete a user by ID
router.get('/users/:id', authenticateAdmin, getUserById); // Get a specific user by ID

// Admin Routes for Demo Accounts
router.get('/demo-accounts', demoAccountCRUD.getAll);
router.post('/demo-accounts', demoAccountCRUD.create);
router.put('/demo-accounts/:id', demoAccountCRUD.update);
router.delete('/demo-accounts/:id', demoAccountCRUD.delete);
router.get('/demo-accounts/:id', demoAccountCRUD.getById);

// Admin Routes for Demo Transactions
router.get('/demo-transactions', demoTransactionCRUD.getAll);
router.post('/demo-transactions', demoTransactionCRUD.create);
router.put('/demo-transactions/:id', demoTransactionCRUD.update);
router.delete('/demo-transactions/:id', demoTransactionCRUD.delete);
router.get('/demo-transactions/:id', demoTransactionCRUD.getById);

// Admin Routes for Live Accounts
router.get('/live-accounts', liveAccountCRUD.getAll);
router.post('/live-accounts', liveAccountCRUD.create);
router.put('/live-accounts/:id', liveAccountCRUD.update);
router.delete('/live-accounts/:id', liveAccountCRUD.delete);
router.get('/live-accounts/:id', liveAccountCRUD.getById);

// Admin Routes for Live Transactions
router.get('/live-transactions', liveTransactionCRUD.getAll);
router.post('/live-transactions', liveTransactionCRUD.create);
router.put('/live-transactions/:id', liveTransactionCRUD.update);
router.delete('/live-transactions/:id', liveTransactionCRUD.delete);
router.get('/live-transactions/:id', liveTransactionCRUD.getById);

// Admin Routes for Trades
router.get('/trades', tradesCRUD.getAll);
router.post('/trades', tradesCRUD.create);
router.put('/trades/:id', tradesCRUD.update);
router.delete('/trades/:id', tradesCRUD.delete);
router.get('/trades/:id', tradesCRUD.getById);

// User CRUD
router.get('/users', authenticateAdmin, viewAllUsers); // View all users - Admin-specific
router.post('/users/createuser', authenticateAdmin, createUser); // Create user - Admin-specific
router.put('/users/:id', authenticateAdmin, updateUser); // Update user - Admin-specific
router.delete('/users/:id', authenticateAdmin, deleteUser); // Delete user - Admin-specific

// Get User with Accounts (balance details included)
router.get('/users/:id', authenticateAdmin, getUserWithAccounts); // Get user by ID and their accounts

// Get All Live Accounts
router.get('/userbalance', authenticateAdmin, getAllLiveAccounts); // Fetch all live accounts for all users

// User Balance CRUD (separate routes for deposit, update balance, withdraw)
router.put('/users/:userId/deposit', authenticateAdmin, deposit); // Deposit for a user
router.put('/users/:userId/create-live-account', authenticateAdmin, createLiveAccount); // Create live account for user
router.put('/users/:userId/update-balance', authenticateAdmin, updateBalance); // Update user balance
router.put('/users/:userId/withdraw', authenticateAdmin, withdraw); // Withdraw for a user

router.get("/balance/:id", getLiveAccountBalanceById);
export default router;
