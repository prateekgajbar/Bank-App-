import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

function Dashboard({ user, token }) {
  const [balance, setBalance] = useState(user?.balance || 0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/account/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setBalance(data.user.balance);
        setRecentTransactions(data.recentTransactions);
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Connection error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTransactionIcon = (transaction) => {
    if (transaction.type === 'deposit') return '💰';
    if (transaction.type === 'withdrawal') return '💸';
    if (transaction.senderId === user?.id) return '📤';
    return '📥';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Account Number: {user?.accountNumber}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        {/* Balance Card */}
        <div className="card balance-card">
          <div className="card-header">
            <h2>Account Balance</h2>
            <span className="refresh-btn" onClick={fetchDashboardData}>🔄</span>
          </div>
          <div className="balance-amount">₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <p className="balance-label">Available Balance</p>
        </div>

        {/* Account Info Card */}
        <div className="card info-card">
          <h3>Account Details</h3>
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="label">Account Type:</span>
            <span className="value">Savings</span>
          </div>
          <div className="info-row">
            <span className="label">Member Since:</span>
            <span className="value">{new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card actions-card">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => window.location.href = '/#/transfer'}>
              <span className="icon">💸</span>
              <span>Transfer</span>
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/#/history'}>
              <span className="icon">📊</span>
              <span>History</span>
            </button>
            <button className="action-btn">
              <span className="icon">🏦</span>
              <span>Deposits</span>
            </button>
            <button className="action-btn">
              <span className="icon">⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card transactions-card">
        <div className="card-header">
          <h2>Recent Transactions</h2>
          <a href="/#/history" className="view-all-link">View All →</a>
        </div>

        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : recentTransactions.length === 0 ? (
          <div className="no-data">No transactions yet</div>
        ) : (
          <div className="transactions-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-left">
                  <span className="transaction-icon">{getTransactionIcon(transaction)}</span>
                  <div className="transaction-info">
                    <p className="transaction-type">
                      {transaction.type === 'deposit' && 'Deposit'}
                      {transaction.type === 'withdrawal' && 'Withdrawal'}
                      {transaction.type === 'transfer' && transaction.senderId === user?.id ? 'Sent to ' + transaction.receiverName : 'Received from ' + transaction.senderName}
                    </p>
                    <p className="transaction-date">{formatDate(transaction.timestamp)}</p>
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.senderId === user?.id && transaction.type === 'transfer' ? 'outgoing' : 'incoming'}`}>
                  {transaction.senderId === user?.id && transaction.type === 'transfer' ? '-' : '+'}₹ {transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
