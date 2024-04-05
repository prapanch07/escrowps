const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users')
// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

// Define routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern_e_com', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});