import React, { useState, useEffect, useContext } from 'react';
import { authAPI } from '../api';
import { WalletContext } from '../context/WalletContext';
import './Admin.css';
import WebSocketService from '../services/WebSocketService';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { getBalance, token } = useContext(WalletContext);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data);
    } catch {
      setError('Failed to fetch users');
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await authAPI.toggleUserStatus(userId);
      // No need to fetchUsers() here - update will come via WebSocket
    } catch {
      setError('Failed to update user status');
    }
  };

  const resetWallet = async (userId) => {
    try {
      await authAPI.resetUserWallet(userId);
      // No need to updateBalance() or fetchUsers() here - updates will come via WebSocket
    } catch {
      setError('Failed to reset wallet');
    }
  };

  useEffect(() => {
    fetchUsers();
    
    if (token) {
      // Connect to WebSocket
      WebSocketService.connect(token);
      
      // Set up event listeners
      WebSocketService.on('USER_UPDATED', (user) => {
        setUsers(prevUsers => 
          prevUsers.map(u => u._id === user._id ? user : u)
        );
      });
      
      WebSocketService.on('BALANCE_UPDATED', ({ userId, balance }) => {
        setUsers(prevUsers =>
          prevUsers.map(u => 
            u._id === userId ? { ...u, walletBalance: balance } : u
          )
        );
      });
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, [token]);

  return (
    <div className="admin-dashboard">
      <h2>User Management</h2>
      {error && <div className="error">{error}</div>}
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Wallet ID</th>
            <th>Wallet Balance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.accountNumber || 'Not Created'}</td>
              <td>{user.balance}</td>
              <td>{user.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => toggleUserStatus(user._id)}>
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => resetWallet(user._id)}>
                  Reset Wallet
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
