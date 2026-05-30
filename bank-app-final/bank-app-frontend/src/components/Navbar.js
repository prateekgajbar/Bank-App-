import React from 'react';
import '../styles/Navbar.css';

function Navbar({ currentPage, onNavigate, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">🏦</span>
          <span className="brand-name">Bank App</span>
        </div>

        <ul className="navbar-menu">
          <li>
            <button
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('dashboard')}
            >
              🏠 Dashboard
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'transfer' ? 'active' : ''}`}
              onClick={() => onNavigate('transfer')}
            >
              💸 Transfer
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
              onClick={() => onNavigate('history')}
            >
              📊 History
            </button>
          </li>
          <li>
            <button className="nav-link logout-btn" onClick={onLogout}>
              🚪 Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
