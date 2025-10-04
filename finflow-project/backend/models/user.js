// backend/models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: Number,
    name: String,
    role: { type: String, enum: ['Employee', 'Manager'] },
    manager_id: { type: Number, ref: 'User' }
}, { _id: false });

module.exports = mongoose.model('User', userSchema);