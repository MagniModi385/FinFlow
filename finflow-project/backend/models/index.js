// backend/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./user');
const Expense = require('./expense');
const Company = require('./company');

const app = express();
const PORT = 3001;
const MONGO_URI = 'mongodb://localhost:27017/finflow';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to finflow.db.'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/signup', async (req, res) => {
    console.log('Signup request received:', req.body);
    try {
        const { companyName, adminName, email, password } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'This email is already in use.' });
        }
        // if (await Company.countDocuments() > 0) {
        //     return res.status(400).json({ message: 'A company is already registered. Please sign in.' });
        // }
        const existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({ message: 'A company with fuck this name is already registered.' });
        }

        const newCompany = new Company({ name: companyName, defaultCurrency: 'INR' });
        await newCompany.save();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new User({
            name: adminName,
            email,
            password: hashedPassword,
            role: 'Admin',
            company_id: newCompany._id
        });
        await newAdmin.save();

        res.status(201).json({ message: 'Company and Admin created successfully.' });
    } catch (err) {
        console.error("SIGNUP ERROR:", err);
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

app.post('/api/auth/signin', async (req, res) => {
    console.log('Signin request received:', req.body);
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        
        // Don't send the password back to the frontend
        const userToReturn = { _id: user._id, name: user.name, email: user.email, role: user.role };
        res.status(200).json({ message: 'Login successful', user: userToReturn });

    } catch (err) {
        console.error("SIGNIN ERROR:", err);
        res.status(500).json({ message: 'Server error during signin.' });
    }
});

// --- OTHER API ROUTES ---
app.get('/api/users', async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});