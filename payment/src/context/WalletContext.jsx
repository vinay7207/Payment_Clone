import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balances, setBalances] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(Date.now());

  const fetchBalance = async (userId) => {
    try {
      const response = await authAPI.getUserWallet(userId);
      setBalances(prev => ({...prev, [userId]: response.data.walletBalance}));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchBalance(currentUserId);
    }
  }, [currentUserId, refreshTrigger]);

  const updateBalance = (newBalance, userId = currentUserId) => {
    if (!userId) return;
    setBalances(prev => ({...prev, [userId]: newBalance}));
    setRefreshTrigger(Date.now());
  };

  const getBalance = (userId = currentUserId) => {
    return userId ? balances[userId] || 0 : 0;
  };

  return (
    <WalletContext.Provider value={{ 
      balance: getBalance(), 
      getBalance,
      updateBalance, 
      setUserId: setCurrentUserId 
    }}>
      {children}
    </WalletContext.Provider>
  );
};
