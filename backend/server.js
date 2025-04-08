import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { WebSocketServer } from 'ws';

const app = express();
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket Server Setup
const wss = new WebSocketServer({ server });
const adminClients = new Set();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const { type, token } = JSON.parse(message);
      if (type === 'admin-auth') {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (!err && decoded.isAdmin) {
            adminClients.add(ws);
            ws.userId = decoded.userId;
          }
        });
      }
    } catch (err) {
      console.error('WS message error:', err);
    }
  });

  ws.on('close', () => adminClients.delete(ws));
});

const broadcastToAdmins = (event, data) => {
  const message = JSON.stringify({ event, data });
  adminClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Enhanced request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/paygo';

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
  console.error('MongoDB connection error:', error);
  console.log('Please ensure MongoDB is running or provide a valid connection string');
});

// Record transaction helper
const recordTransaction = async (user, amount, type, description = '', reference = '') => {
  const transaction = {
    transactionId: `txn_${Date.now()}`,
    amount,
    type,
    description,
    reference,
    balanceAfter: type === 'credit' 
      ? user.walletBalance + amount 
      : user.walletBalance - amount
  };
  user.transactions.push(transaction);
  await user.save();
  return transaction;
};

import User from './models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Auth Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with email:', email);
    }
    
    console.log('Found user:', user.email);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('Password mismatch for user:', user.email);
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check endpoints (with explicit root path)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'UP',
    db: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date()
  });
});

app.get('/', (req, res) => {
  res.send('PAY & GO Backend API');
});

// Test user creation endpoint (temporary)
app.post('/api/create-test-user', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: hashedPassword,
      isActive: true
    });
    await user.save();
    res.status(201).json({ message: 'Test user created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simplified admin authentication
const authenticateAdmin = (req, res, next) => {
  // Bypass authentication for direct access
  next();
};

// Get all users (admin only)
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle user active status
app.put('/api/admin/users/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate unique 10-digit account number
const generateAccountNumber = async () => {
  let accountNumber;
  do {
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  } while (await User.findOne({ accountNumber }));
  return accountNumber;
};

// Create wallet with account number
app.post('/api/users/:id/wallet', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (user.hasActiveWallet) {
      return res.status(400).json({ error: 'User already has an active wallet' });
    }

    const accountNumber = await generateAccountNumber();
    user.accountNumber = accountNumber;
    user.hasActiveWallet = true;
    user.walletBalance = 0;
    await user.save();

    res.json({
      message: 'Wallet created successfully',
      accountNumber,
      walletBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add funds to wallet
app.post('/api/users/:id/wallet/funds', authenticateAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.hasActiveWallet) {
      return res.status(400).json({ error: 'User has no active wallet' });
    }

    user.walletBalance += amount;
    const transaction = await recordTransaction(
      user,
      amount,
      'credit',
      'Funds added',
      `admin-${req.user.id}`
    );
    await user.save();

    res.json({
      message: 'Funds added successfully',
      newBalance: user.walletBalance,
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Withdraw funds from wallet
app.post('/api/users/:id/wallet/withdraw', authenticateAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.hasActiveWallet) {
      return res.status(400).json({ error: 'User has no active wallet' });
    }
    if (user.walletBalance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    user.walletBalance -= amount;
    const transaction = await recordTransaction(
      user,
      amount,
      'debit',
      'Funds withdrawn',
      `admin-${req.user.id}`
    );
    await user.save();

    res.json({
      message: 'Funds withdrawn successfully',
      newBalance: user.walletBalance,
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get wallet details with improved validation
app.get('/api/users/:userId/wallet', async (req, res) => {
  try {
    // Validate userId parameter
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(req.params.userId)
      .select('walletBalance accountNumber hasActiveWallet');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        details: `No user found with ID: ${req.params.userId}`
      });
    }

    if (!user.hasActiveWallet) {
      return res.status(404).json({ 
        error: 'Wallet not found',
        details: 'User does not have an active wallet'
      });
    }

    res.json({
      success: true,
      data: {
        balance: user.walletBalance,
        accountNumber: user.accountNumber,
        currency: 'INR',  // Added currency info
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error(`Wallet lookup error for user ${req.params.userId}:`, error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Reset user wallet
app.put('/api/admin/users/:id/wallet', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.walletBalance = 0;
    user.hasActiveWallet = false;
    user.accountNumber = undefined;
    await user.save();

    res.json({
      message: 'Wallet reset and deactivated',
      user: {
        id: user._id,
        hasActiveWallet: user.hasActiveWallet,
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
console.log(`Create test user: POST http://localhost:${PORT}/api/create-test-user`);
console.log(`Admin login: POST http://localhost:${PORT}/api/admin/login`);
