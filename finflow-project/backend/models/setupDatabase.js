// backend/models/setupDatabase.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./user');
const Expense = require('./expense');
const Company = require('./company');

const MONGO_URI = 'mongodb://localhost:27017/finflow';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding.');

        await Company.deleteMany({});
        await User.deleteMany({});
        await Expense.deleteMany({});
        console.log('Cleared existing companies, users, and expenses.');

        const demoCompany = new Company({ name: 'Demo Corp', defaultCurrency: 'USD' });
        await demoCompany.save();
        console.log('Demo Company created.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        const aliceManager = new User({
            name: 'Alice Manager',
            email: 'alice@demo.com',
            password: hashedPassword,
            role: 'Manager',
            company_id: demoCompany._id
        });
        await aliceManager.save();
        console.log('Alice Manager created.');

        const bobEmployee = new User({
            name: 'Bob Employee',
            email: 'bob@demo.com',
            password: hashedPassword,
            role: 'Employee',
            company_id: demoCompany._id,
            manager_id: aliceManager._id
        });
        await bobEmployee.save();
        console.log('Bob Employee created.');

        console.log('Database seeding was successful!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};
//database error has been solved 
seedDatabase();
