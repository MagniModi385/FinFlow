// backend/models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Employee', 'Manager', 'Admin'], required: true },
    manager_id: { type: Schema.Types.ObjectId, ref: 'User' },
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true }
});

module.exports = mongoose.model('User', userSchema);