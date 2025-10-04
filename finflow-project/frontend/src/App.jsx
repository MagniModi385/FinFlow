// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/users`).then(response => setUsers(response.data));
  }, []);

  const fetchExpenses = (userId) => {
    axios.get(`${API__URL}/expenses/${userId}`)
      .then(response => setExpenses(response.data));
  };

  const handleLogin = (userId) => {
    if (!userId) {
      setCurrentUser(null);
      return;
    }
    const user = users.find(u => u._id === parseInt(userId));
    setCurrentUser(user);
    if (user.role === 'Employee') {
      fetchExpenses(user._id);
    }
  };

  const handleSubmitExpense = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/expenses`, {
      userId: currentUser._id,
      description,
      amount: parseFloat(amount)
    }).then(() => {
      fetchExpenses(currentUser._id);
      setDescription('');
      setAmount('');
    });
  };

  if (!currentUser) {
    return (
      <div className="container">
        <h1>Welcome to FinFlow</h1>
        <div className="user-selector">
          <h2>Select User to Login</h2>
          <select onChange={(e) => handleLogin(e.target.value)} defaultValue="">
            <option value="">Choose a user</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>FinFlow</h1>
      <h2>Welcome, {currentUser.name}!</h2>
      <button onClick={() => handleLogin(null)}>Logout</button>

      {currentUser.role === 'Employee' && (
        <div>
          <h3>Submit a New Expense</h3>
          <form onSubmit={handleSubmitExpense} className="expense-form">
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button type="submit">Submit</button>
          </form>

          <h3>Your Expenses</h3>
          <ul className="expense-list">
            {expenses.map(exp => (
              <li key={exp._id}>
                <span>{exp.description} - ${exp.amount}</span>
                <span className="status">{exp.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;