const express = require('express');
const cors = require('cors');
const connection_service = require('./services/dbConnect');

require('dotenv').config({ path: './.env' });
require('colors');

// Port
const port = process.env.PORT || 3000;

// Initializing app
const app = express();
app.use(express.json());
app.use(cors());

// DB connection
connection_service.db_connect;

// Routes
app.get('/', (req, res) => {
    res.status(200).json(
        {
            message: 'Welcome to the Ex-Rail Server'
        }
    );
})

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/wish', require('./routes/wish.route'));
app.use('/api/expenses', require('./routes/expenses.route'));
app.use('/api/income', require('./routes/income.route'));
app.use('/api/user', require('./routes/user.route'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: err.message
    })
})

// Starting the server
module.exports = app.listen(port, () => {
    console.log(`Ex-Rail API listening at port ${port}`.blue)
})