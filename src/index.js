"use strict";

require('./models/Coins');
require('dotenv').config();
const mongoose = require('mongoose');

const coinsRoutes = require('./routes/coinsRoutes');
const express = require('express');
const app = express();

app.use(express.json());
app.use(coinsRoutes);

const PORT = process.env.PORT || 3000;

const mongoUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@coinapi.jrg0g.mongodb.net/CoinApi?retryWrites=true&w=majority`;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to Mongo instance...');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connection to mongo instance: ' + err);
});

app.get('/', async (req, res) => {
    res.send(`<h1>Main Page</h1>`);
});

app.listen(PORT, (req, res) => {
    console.log(`Listening on port: ${PORT}`);
});
