const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

userRoutes = require('./src/routes/route.user');
biodataRoutes = require('./src/routes/route.biodata');

app.use('/api/users', userRoutes);
app.use('/api/biodata', biodataRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
