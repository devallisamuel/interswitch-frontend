import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">Health Tracker</h1>
        {user && (
          <div className="user-info">
            <span className="welcome-text">Welcome, {user.username}!</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
