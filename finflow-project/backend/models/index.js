// backend/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./user');
const Expense = require('./expense');

const app = express();
const PORT = 3001;
const MONGO_URI = 'mongodb://localhost:27017/finflow';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to finflow.db via Mongoose.'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/expenses/:userId', async (req, res) => {
    try {
        const expenses = await Expense.find({ user_id: req.params.userId }).sort({ _id: -1 });
        res.json(expenses);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/expenses', async (req, res) => {
    try {
        const newExpense = new Expense({
            description: req.body.description,
            amount: req.body.amount,
            user_id: req.body.userId,
        });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});