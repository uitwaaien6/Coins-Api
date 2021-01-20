"use strict";

require('dotenv').config();
const coinsRoutes = require('./routes/coinsRoutes');
const express = require('express');
const app = express();

app.use(express.json());
app.use(coinsRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    res.send(`<h1>Main Page</h1>`);
});

app.listen(PORT, (req, res) => {
    console.log(`Listening on port: ${PORT}`);
});
