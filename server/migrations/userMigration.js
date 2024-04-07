const mongoose = require('mongoose');
const User = require('../models/user');

async function migrate() {
    try {
        const users = await User.find();
        for (const user of users) {
            if (!user.isAdmin || !user.isSeller) {
                user.isAdmin = false; // Set isAdmin to false if not already set
                user.isSeller = false; // Set isSeller to false if not already set
                await user.save();
            }
        }
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrate();