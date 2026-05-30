import React, { useState, useEffect } from 'react';
import '../styles/TransactionHistory.css';

function TransactionHistory({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get user ID from token or localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserId(user.id);
    fetchTransactions();
  }, [token]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filterType, searchTerm]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions);
      } else {
        setError(data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError('Connection error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== 'all') {
      if (filterType === 'sent') {
        filtered = filtered.filter(t => t.senderId === userId && t.type === 'transfer');
      } else if (filterType === 'received') {
        filtered = filtered.filter(t => t.receiverId === userId && t.type === 'transfer');
      } else if (filterType === 'deposit') {
        filtered = filtered.filter(t => t.type === 'deposit');
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.receiverAccount?.includes(searchTerm) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTransactionIcon = (transaction) => {
    if (transaction.type === 'deposit') return '💰';
    if (transaction.type === 'withdrawal') return '💸';
    if (transaction.senderId === userId) return '📤';
    return '📥';
  };

  const getTransactionLabel = (transaction) => {
    if (transaction.type === 'deposit') return 'Deposit';
    if (transaction.type === 'withdrawal') return 'Withdrawal';
    if (transaction.senderId === userId) return 'Sent to ' + transaction.receiverName;
    return 'Received from ' + transaction.senderName;
  };

  const calculateStats = () => {
    const sent = transactions
      .filter(t => t.senderId === userId && t.type === 'transfer')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const received = transactions
      .filter(t => t.receiverId === userId && t.type === 'transfer')
      .reduce((sum, t) => sum + t.amount, 0);

    return { sent, received };
  };

  const stats = calculateStats();

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Transaction History</h1>
        <button onClick={fetchTransactions} className="refresh-btn">🔄 Refresh</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <p className="stat-label">Total Sent</p>
            <p className="stat-value">₹ {stats.sent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📥</div>
          <div className="stat-content">
            <p className="stat-label">Total Received</p>
            <p className="stat-value">₹ {stats.received.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Transactions</p>
            <p className="stat-value">{transactions.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="filterType">Filter by Type:</label>
          <select 
            id="filterType" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Transactions</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
            <option value="deposit">Deposits</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="searchTerm">Search:</label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, account, or description..."
            className="filter-input"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="transactions-section">
        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="no-data">
            {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}
          </div>
        ) : (
          <div className="transactions-list">
            {filteredTransactions.map((transaction) => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-main">
                  <span className="transaction-icon">{getTransactionIcon(transaction)}</span>
                  <div className="transaction-details">
                    <p className="transaction-type">{getTransactionLabel(transaction)}</p>
                    <p className="transaction-date">{formatDate(transaction.timestamp)}</p>
                    {transaction.description && (
                      <p className="transaction-description">{transaction.description}</p>
                    )}
                  </div>
                </div>
                <div className="transaction-amount-section">
                  <div className={`transaction-amount ${transaction.senderId === userId && transaction.type === 'transfer' ? 'outgoing' : 'incoming'}`}>
                    {transaction.senderId === userId && transaction.type === 'transfer' ? '-' : '+'}₹ {transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <span className={`transaction-status ${transaction.status}`}>{transaction.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
