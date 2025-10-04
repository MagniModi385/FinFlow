// backend/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('./user');
const Expense = require('./expense');
const Company = require('./company');

const app = express();
const PORT = 3001;
const MONGO_URI = 'mongodb://localhost:27017/finflow';

mongoose.connect(MONGO_URI).then(() => console.log('Connected to finflow.db.')).catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE ---
const managerAuth = async (req, res, next) => {
    try {
        const userId = req.headers['user-id'];
        if (!userId) return res.status(401).json({ message: 'User ID not provided.' });
        const user = await User.findById(userId);
        if (user && (user.role === 'Admin' || user.role === 'Manager')) next();
        else res.status(403).json({ message: 'Forbidden: Admin or Manager access required.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during authentication.' });
    }
};

// --- AUTHENTICATION & USER ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { companyName, adminName, email, password, country, defaultCurrency } = req.body;
        if (!country || !defaultCurrency) return res.status(400).json({ message: 'Country and currency are required.' });
        if (await User.findOne({ email })) return res.status(400).json({ message: 'This email is already in use.' });
        if (await Company.findOne({ name: companyName })) return res.status(400).json({ message: 'A company with this name is already registered.' });
        
        const newCompany = new Company({ name: companyName, country, defaultCurrency });
        await newCompany.save();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new User({ name: adminName, email, password: hashedPassword, role: 'Admin', isTemporaryPassword: false, company_id: newCompany._id });
        await newAdmin.save();

        res.status(201).json({ message: 'Company and Admin created successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        const userToReturn = { _id: user._id, name: user.name, email: user.email, role: user.role, company_id: user.company_id, isTemporaryPassword: user.isTemporaryPassword };
        res.status(200).json({ message: 'Login successful', user: userToReturn });
    } catch (err) {
        res.status(500).json({ message: 'Server error during signin.' });
    }
});

app.post('/api/users/set-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect temporary password.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.isTemporaryPassword = false;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error while setting password.' });
    }
});

// --- EXPENSE ROUTES ---
app.post('/api/expenses', async (req, res) => {
    try {
        const { description, amount, category, userId, companyId } = req.body;
        if (!description || !amount || !userId || !companyId) return res.status(400).json({ message: 'Please provide all required fields.' });
        const newExpense = new Expense({ description, amount, category, user_id: userId, company_id: companyId });
        await newExpense.save();
        res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
    } catch (err) {
        res.status(500).json({ message: 'Server error during expense creation.' });
    }
});

app.get('/api/expenses/:userId', async (req, res) => {
    try {
        const expenses = await Expense.find({ user_id: req.params.userId }).sort({ createdAt: -1 });
        if (!expenses) return res.status(404).json({ message: 'No expenses found for this user.' });
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching expenses.' });
    }
});

// --- ADMIN/MANAGER ROUTES ---
app.post('/api/admin/employees', managerAuth, async (req, res) => {
    try {
        const { name, email, role, companyId } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: 'A user with this email already exists.' });
        const temporaryPassword = crypto.randomBytes(8).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(temporaryPassword, salt);
        const newUser = new User({ name, email, role, password: hashedPassword, company_id: companyId, isTemporaryPassword: true });
        await newUser.save();
        res.status(201).json({ message: 'Employee account created successfully.', employee: newUser, temporaryPassword: temporaryPassword });
    } catch (err) {
        res.status(500).json({ message: 'Server error while creating employee.' });
    }
});

app.get('/api/admin/employees/:companyId', managerAuth, async (req, res) => {
    try {
        const employees = await User.find({ 
            company_id: req.params.companyId,
            _id: { $ne: req.headers['user-id'] } 
        }).select('-password').sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching employees.' });
    }
});

app.delete('/api/admin/employees/:employeeId', managerAuth, async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        if (req.headers['user-id'] === employeeId) {
            return res.status(400).json({ message: "You cannot remove your own account." });
        }
        const deletedUser = await User.findByIdAndDelete(employeeId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        await Expense.deleteMany({ user_id: employeeId });
        res.status(200).json({ message: 'User and their associated expenses have been removed successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error while removing employee.' });
    }
});

app.get('/api/admin/expenses/:companyId', managerAuth, async (req, res) => {
    try {
        const expenses = await Expense.find({ company_id: req.params.companyId }).populate('user_id', 'name email').sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching expenses.' });
    }
});

app.put('/api/admin/expenses/:expenseId/status', managerAuth, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status value.' });
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.expenseId, { status }, { new: true }).populate('user_id', 'name email');
        if (!updatedExpense) return res.status(404).json({ message: 'Expense not found.' });
        res.status(200).json(updatedExpense);
    } catch (err) {
        res.status(500).json({ message: 'Server error while updating status.' });
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));