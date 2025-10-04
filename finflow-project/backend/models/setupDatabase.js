// backend/setupDatabase.js
const mongoose = require('mongoose');
const User = require('./user');
const Expense = require('./expense');

const MONGO_URI = 'mongodb://localhost:27017/finflow';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding.');
        await User.deleteMany({});
        await Expense.deleteMany({});
        console.log('Cleared existing data.');

        await User.create([
            { _id: 1, name: 'Alice Manager', role: 'Manager' },
            { _id: 2, name: 'Bob Employee', role: 'Employee', manager_id: 1 }
        ]);
        console.log('Users seeded successfully.');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

seedDatabase();