import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Transfer from './components/Transfer';
import TransactionHistory from './components/TransactionHistory';
import Navbar from './components/Navbar';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, [token]);

  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleRegister = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('login');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {isAuthenticated && <Navbar currentPage={currentPage} onNavigate={navigateTo} onLogout={handleLogout} />}

      <div className={isAuthenticated ? 'main-content' : ''}>
        {!isAuthenticated ? (
          <>
            {currentPage === 'login' && (
              <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />
            )}
            {currentPage === 'register' && (
              <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage('login')} />
            )}
          </>
        ) : (
          <>
            {currentPage === 'dashboard' && <Dashboard user={user} token={token} />}
            {currentPage === 'transfer' && <Transfer user={user} token={token} onTransferSuccess={() => setCurrentPage('dashboard')} />}
            {currentPage === 'history' && <TransactionHistory token={token} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
