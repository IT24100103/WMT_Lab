const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const studentRoutes = require('./routes/students');
const menuRoutes = require('./routes/menuItems');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');

app.use('/students', studentRoutes);
app.use('/menu-items', menuRoutes);
app.use('/orders', orderRoutes);
app.use('/analytics', analyticsRoutes);

// Root test
app.get('/', (req, res) => {
    res.json({ message: "API is running" });
});

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/campus-food';

// DB connection
mongoose.connect(mongoUri)
.then(() => {
    console.log(`MongoDB Connected: ${mongoUri}`);
    app.listen(3000, () => console.log("Server running on port 3000"));
})
.catch(err => {
    console.error("MongoDB connection error:", err.message);
});
