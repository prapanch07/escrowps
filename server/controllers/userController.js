const User = require('../models/user');
const registerUser = async (req, res) => {
    try {
        const { username, email, password, fullname, isAdmin } = req.body;
        console.log('req.body: ', req.body)
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('existing')
            return res.status(400).json({ message: 'Username already exists' });
        }
        console.log('No user')
        const newUser = new User({ username, email, password, fullname, isAdmin });
        console.log(newUser)
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const jwt = require('jsonwebtoken');
const loginUser = async (req, res) => {
    try {
        const {username, password } = req.body;
        console.log(req.body);
        const user = await User.findOne ({ username });
        console.log(user);
        if (!user || user.password !== password) {
            console.log('Invalid');
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        if (user.deleted){
            return res.status(403).json({ message: 'This account is already deleted.  ' });
        }
        
        return res.status(200).json({ message: 'Login Successful',  username: user.username, user_id: user._id, isSeller: user.isSeller, isAdmin: user.isAdmin, subscriber: user.subscriber });
    } catch (error) {
        console.error('Error in user loging in :', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUsers = async (req, res) => {
    try {
        const customers = await User.find();
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const makeUserSeller = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user)
        user.isSeller = true;
        await user.save();
        console.log(user)
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getuserdetails = async (req, res) => {
    const {userId} = req.params;
    console.log("userId inusecontroller: ",userId);
    try {
        const user = await User.findById(userId)
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetchimg user');
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { registerUser, loginUser, logoutUser, getUsers, makeUserSeller, getuserdetails };

