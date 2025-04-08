import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';
import { authAPI } from '../api';
import './Transection.css';







function Transection() {
  const userId = localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState('wallet');
  const [walletCreated, setWalletCreated] = useState(false);
  const { balance: walletBalance, updateBalance, setUserId } = useContext(WalletContext);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await authAPI.getUserWallet(userId); // Need to get userId from context/auth
        updateBalance(response.data.walletBalance);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };
    
    if (walletCreated) {
      fetchWalletBalance();
    }
  }, [walletCreated, userId]);
  const [sendAmount, setSendAmount] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    ifsc: '',
    accountNo: '',
    amount: ''
  });
  const [travelDetails, setTravelDetails] = useState({
    destination: '',
    amount: ''
  });
  const [rechargeDetails, setRechargeDetails] = useState({
    mobile: '',
    operator: '',
    amount: ''
  });

  const createWallet = () => {
    setWalletCreated(true);
    updateBalance(1000); // Initial balance
    setUserId(localStorage.getItem('userId'));
    alert('Wallet created successfully!');
  };

  const handleSendMoney = (e) => {
    e.preventDefault();
    if (sendAmount > walletBalance) {
      alert('Insufficient balance');
      return;
    }
    updateBalance(walletBalance - parseFloat(sendAmount));
    alert(`₹${sendAmount} sent to ${receiverId}`);
    setSendAmount('');
    setReceiverId('');
  };

  const handleAddMoney = (e) => {
    e.preventDefault();
    updateBalance(walletBalance + parseFloat(addAmount));
    alert(`₹${addAmount} added to wallet`);
    setAddAmount('');
  };

  const handleBankTransfer = (e) => {
    e.preventDefault();
    if (bankDetails.amount > walletBalance) {
      alert('Insufficient balance');
      return;
    }
    updateBalance(walletBalance - parseFloat(bankDetails.amount));
    alert(`₹${bankDetails.amount} transferred to bank account`);
    setBankDetails({ ifsc: '', accountNo: '', amount: '' });
  };

  const handleTravel = (e) => {
    e.preventDefault();
    if (travelDetails.amount > walletBalance) {
      alert('Insufficient balance');
      return;
    }
    updateBalance(walletBalance - parseFloat(travelDetails.amount));
    alert(`Travel booked to ${travelDetails.destination} for ₹${travelDetails.amount}`);
    setTravelDetails({ destination: '', amount: '' });
  };

  const handleRecharge = (e) => {
    e.preventDefault();
    if (rechargeDetails.amount > walletBalance) {
      alert('Insufficient balance');
      return;
    }
    updateBalance(walletBalance - parseFloat(rechargeDetails.amount));
    alert(`Recharge of ₹${rechargeDetails.amount} done for ${rechargeDetails.mobile}`);
    setRechargeDetails({ mobile: '', operator: '', amount: '' });
  };

  return (
    <div className="transection-container">
      <h1>Transaction Portal</h1>
      
      {!walletCreated ? (
        <div className="wallet-creation">
          <h2>Create Your Wallet</h2>
          <p>To start using our services, please create your wallet first</p>
          <button onClick={createWallet} className="create-wallet-btn">
            Create Wallet
          </button>
        </div>
      ) : (
        <div className="transaction-content">
          <div className="wallet-info">
            <h3>Your Wallet Balance: ₹{walletBalance}</h3>
          </div>

          <div className="tabs">
            <button 
              className={activeTab === 'wallet' ? 'active' : ''}
              onClick={() => setActiveTab('wallet')}
            >
              Wallet
            </button>
            <button 
              className={activeTab === 'send' ? 'active' : ''}
              onClick={() => setActiveTab('send')}
            >
              Send Money
            </button>
            <button 
              className={activeTab === 'add' ? 'active' : ''}
              onClick={() => setActiveTab('add')}
            >
              Add Money
            </button>
            <button 
              className={activeTab === 'bank' ? 'active' : ''}
              onClick={() => setActiveTab('bank')}
            >
              Bank Transfer
            </button>
            <button 
              className={activeTab === 'travel' ? 'active' : ''}
              onClick={() => setActiveTab('travel')}
            >
              Travel
            </button>
            <button 
              className={activeTab === 'recharge' ? 'active' : ''}
              onClick={() => setActiveTab('recharge')}
            >
              Recharge
            </button>
            <button 
              className={activeTab === 'refer' ? 'active' : ''}
              onClick={() => setActiveTab('refer')}
            >
              Refer & Earn
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'wallet' && (
              <div className="wallet-details">
                <h3>Wallet Details</h3>
                <p>Balance: ₹{walletBalance}</p>
                <p>Wallet ID: WALLET{Math.floor(Math.random() * 1000000)}</p>
                <p>Status: Active</p>
              </div>
            )}

            {activeTab === 'send' && (
              <form onSubmit={handleSendMoney} className="transaction-form">
                <h3>Send Money</h3>
                <div className="form-group">
                  <label>Receiver ID:</label>
                  <input
                    type="text"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Send</button>
              </form>
            )}

            {activeTab === 'add' && (
              <form onSubmit={handleAddMoney} className="transaction-form">
                <h3>Add Money</h3>
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Add</button>
              </form>
            )}

            {activeTab === 'bank' && (
              <form onSubmit={handleBankTransfer} className="transaction-form">
                <h3>Bank Transfer</h3>
                <div className="form-group">
                  <label>IFSC Code:</label>
                  <input
                    type="text"
                    value={bankDetails.ifsc}
                    onChange={(e) => setBankDetails({...bankDetails, ifsc: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Account Number:</label>
                  <input
                    type="text"
                    value={bankDetails.accountNo}
                    onChange={(e) => setBankDetails({...bankDetails, accountNo: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    value={bankDetails.amount}
                    onChange={(e) => setBankDetails({...bankDetails, amount: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Transfer</button>
              </form>
            )}

            {activeTab === 'travel' && (
              <form onSubmit={handleTravel} className="transaction-form">
                <h3>Book Travel</h3>
                <div className="form-group">
                  <label>Destination:</label>
                  <input
                    type="text"
                    value={travelDetails.destination}
                    onChange={(e) => setTravelDetails({...travelDetails, destination: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    value={travelDetails.amount}
                    onChange={(e) => setTravelDetails({...travelDetails, amount: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Book</button>
              </form>
            )}

            {activeTab === 'recharge' && (
              <form onSubmit={handleRecharge} className="transaction-form">
                <h3>Mobile Recharge</h3>
                <div className="form-group">
                  <label>Mobile Number:</label>
                  <input
                    type="text"
                    value={rechargeDetails.mobile}
                    onChange={(e) => setRechargeDetails({...rechargeDetails, mobile: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Operator:</label>
                  <select
                    value={rechargeDetails.operator}
                    onChange={(e) => setRechargeDetails({...rechargeDetails, operator: e.target.value})}
                    required
                  >
                    <option value="">Select Operator</option>
                    <option value="Airtel">Airtel</option>
                    <option value="Jio">Jio</option>
                    <option value="Vi">Vi</option>
                    <option value="BSNL">BSNL</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    value={rechargeDetails.amount}
                    onChange={(e) => setRechargeDetails({...rechargeDetails, amount: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Recharge</button>
              </form>
            )}

            {activeTab === 'refer' && (
              <div className="refer-content">
                <h3>Refer & Earn</h3>
                <p>Share your referral code and earn ₹100 for each successful referral!</p>
                <div className="referral-code">
                  <p>Your Referral Code:</p>
                  <div className="code">REF{Math.floor(Math.random() * 10000)}</div>
                </div>
                <button className="share-btn">Share Code</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Transection;
