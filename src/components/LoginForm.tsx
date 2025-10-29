import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters long');
      return;
    }

    setError('');
    login(username.trim());
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Health Tracker</h1>
        <p>Please enter your username to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        
        <div className="sample-credentials">
          <h3>Sample Credentials for Testing:</h3>
          <ul>
            <li>john_doe</li>
            <li>jane_smith</li>
            <li>test_user</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
