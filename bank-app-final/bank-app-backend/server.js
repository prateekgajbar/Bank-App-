const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bankapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  senderId: mongoose.Schema.Types.ObjectId,
  senderName: String,
  receiverId: mongoose.Schema.Types.ObjectId,
  receiverName: String,
  receiverAccount: String,
  amount: Number,
  type: { type: String, enum: ['transfer', 'deposit', 'withdrawal'], default: 'transfer' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  description: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Utility function to generate account number
function generateAccountNumber() {
  return 'ACC' + Date.now() + Math.floor(Math.random() * 10000);
}

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = generateAccountNumber();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      accountNumber,
      balance: 5000 // Initial balance
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// ============ MIDDLEWARE: Verify Token ============

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// ============ ACCOUNT ROUTES ============

// Get Dashboard Info
app.get('/api/account/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recentTransactions = await Transaction.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }]
    }).limit(5).sort({ timestamp: -1 });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance,
        createdAt: user.createdAt
      },
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard', error: error.message });
  }
});

// Get Balance
app.get('/api/account/balance', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch balance', error: error.message });
  }
});

// ============ TRANSACTION ROUTES ============

// Transfer Money
app.post('/api/transactions/transfer', verifyToken, async (req, res) => {
  try {
    const { receiverAccount, amount, description } = req.body;

    if (!receiverAccount || !amount) {
      return res.status(400).json({ message: 'Receiver account and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const sender = await User.findById(req.userId);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const receiver = await User.findOne({ accountNumber: receiverAccount });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver account not found' });
    }

    // Update balances
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    // Create transaction record
    const transaction = new Transaction({
      senderId: sender._id,
      senderName: sender.name,
      receiverId: receiver._id,
      receiverName: receiver.name,
      receiverAccount: receiver.accountNumber,
      amount,
      type: 'transfer',
      status: 'completed',
      description: description || 'Money Transfer'
    });

    await transaction.save();

    res.json({
      message: 'Transfer successful',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Transfer failed', error: error.message });
  }
});

// Get Transaction History
app.get('/api/transactions/history', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }]
    }).sort({ timestamp: -1 });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
});

// Deposit Money (Admin/Internal)
app.post('/api/transactions/deposit', verifyToken, async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const user = await User.findById(req.userId);
    user.balance += amount;
    await user.save();

    const transaction = new Transaction({
      senderId: null,
      receiverId: user._id,
      receiverName: user.name,
      receiverAccount: user.accountNumber,
      amount,
      type: 'deposit',
      status: 'completed',
      description: description || 'Deposit'
    });

    await transaction.save();

    res.json({
      message: 'Deposit successful',
      balance: user.balance,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Deposit failed', error: error.message });
  }
});

// ============ USER ROUTES ============

// Get User Profile
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      accountNumber: user.accountNumber,
      balance: user.balance,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
