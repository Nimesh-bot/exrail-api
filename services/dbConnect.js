const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const db_password = process.env.MONGO_PASSWORD;

const db_connect = mongoose.connect(`mongodb+srv://saqyeah:${db_password}@storage.wkdfkew.mongodb.net/exrailTestServer?retryWrites=true&w=majority`)

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Database connection initialized'.cyan.underline);
})

module.exports = db_connect;