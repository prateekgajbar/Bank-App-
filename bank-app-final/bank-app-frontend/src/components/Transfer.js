import React, { useState } from 'react';
import '../styles/Transfer.css';

function Transfer({ user, token, onTransferSuccess }) {
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');

    if (!receiverAccount || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setShowConfirm(true);
  };

  const confirmTransfer = async () => {
    setLoading(true);
    setShowConfirm(false);

    try {
      const response = await fetch('http://localhost:5000/api/transactions/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverAccount,
          amount: parseFloat(amount),
          description: description || 'Money Transfer'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Transfer successful! Transaction ID: ' + data.transaction._id);
        setReceiverAccount('');
        setAmount('');
        setDescription('');

        setTimeout(() => {
          onTransferSuccess();
        }, 2000);
      } else {
        setError(data.message || 'Transfer failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-container">
      <div className="transfer-card">
        <div className="card-header">
          <h1>Money Transfer</h1>
          <p>Send money to another account</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleTransfer} className="transfer-form">
          <div className="form-section">
            <h3>Your Account</h3>
            <div className="account-display">
              <div className="account-info">
                <p className="account-name">{user?.name}</p>
                <p className="account-number">{user?.accountNumber}</p>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Recipient Details</h3>

            <div className="form-group">
              <label htmlFor="receiverAccount">Receiver Account Number *</label>
              <input
                type="text"
                id="receiverAccount"
                value={receiverAccount}
                onChange={(e) => setReceiverAccount(e.target.value)}
                placeholder="e.g., ACC1234567890"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount (₹) *</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Monthly rent, Gift, etc."
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirm Transfer</h2>
              <div className="confirmation-details">
                <div className="detail-row">
                  <span className="label">From:</span>
                  <span className="value">{user?.name} ({user?.accountNumber})</span>
                </div>
                <div className="detail-row">
                  <span className="label">To:</span>
                  <span className="value">{receiverAccount}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Amount:</span>
                  <span className="value amount">₹ {parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                {description && (
                  <div className="detail-row">
                    <span className="label">Description:</span>
                    <span className="value">{description}</span>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowConfirm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={confirmTransfer} className="btn-primary">
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="transfer-info">
        <h3>Transfer Information</h3>
        <ul>
          <li>✓ Transfers are processed instantly</li>
          <li>✓ No charges for transfers between accounts</li>
          <li>✓ Minimum transfer amount: ₹1</li>
          <li>✓ 24/7 access to transfer money</li>
        </ul>
      </div>
    </div>
  );
}

export default Transfer;
