const User = require('../models/user');

const registerUser = async (req, res) => {
    try {
        const { username, email, password, fullname } = req.body;
        console.log(req.body)
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('existing')
            return res.status(400).json({ message: 'Username already exists' });
        }
        console.log('No user')
        const newUser = new User({ username, email, password, fullname });
        console.log(newUser)
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const loginUser = async(req, res) => {
    try {
        const {username, password} = req.body;
        console.log(req.body)
        const user = await User.findOne({ username });
        if (!user || user.password != password) {
            return res.status(401).json({message: 'Invalid username or password'});
        }
        return status(200).json({ message: 'Loggin successful', user });
    } catch (error) {
        console.error('Error in user logging in: ', error);
        res.status(500).json({ message : 'Internal server error'});
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
module.exports = { registerUser, loginUser, logoutUser };