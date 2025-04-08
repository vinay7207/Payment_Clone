import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  accountNumber: { 
    type: Number, 
    unique: true,
    min: 1000000000,
    max: 9999999999
  },
  hasActiveWallet: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  transactions: [{
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    date: { type: Date, default: Date.now },
    description: String,
    reference: String,
    balanceAfter: { type: Number, required: true }
  }]
});

// Add index for frequently queried fields
UserSchema.index({ email: 1, isActive: 1 });

export default mongoose.model('User', UserSchema);
