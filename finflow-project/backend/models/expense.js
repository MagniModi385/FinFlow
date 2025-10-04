// backend/models/expense.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    description: String,
    amount: Number,
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    user_id: { type: Number, ref: 'User' }
});

module.exports = mongoose.model('Expense', expenseSchema);