"use strict";

const express = require('express');
const axios = require('axios');

const router = express.Router();

let backupCoinsArray = [];
let apiKeyIndex = 0;
let currentApiKey = process.env.API_KEY_0; // initial api key;
const threeMin = 180000;

function initCoinTimer(callback, updateTime) {
    callback();
    setInterval(() => callback(), updateTime);
}

function increaseApiKeyIndex() {
    apiKeyIndex++;
    if (apiKeyIndex >= 2) apiKeyIndex = 0;
}

function makeFirstUpper(word) {
    return word[0].toUpperCase() + word.substr(1, word.length).toLowerCase();
}

async function updateCoins() {

    try {

        switch (apiKeyIndex) {
            case 0:
                currentApiKey = process.env.API_KEY_0 ? process.env.API_KEY_0 : process.env.API_KEY_0;
                increaseApiKeyIndex();
                break;
            case 1:
                currentApiKey = process.env.API_KEY_1 ? process.env.API_KEY_1 : process.env.API_KEY_0;
                increaseApiKeyIndex();
                break;
            case 2:
                currentApiKey = process.env.API_KEY_2 ? process.env.API_KEY_2 : process.env.API_KEY_0;
                increaseApiKeyIndex();
                break;
            default:
                currentApiKey = process.env.API_KEY_0;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CMC_PRO_API_KEY': currentApiKey
            }
        }
    
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', config);
        const data = response.data.data;

        backupCoinsArray = [...data];

    } catch (error) {
        console.log(error.message);
    }

}

router.get('/api', async (req, res) => {
    try {

        const html = `
            <h1>API Documentation</h1>

            <h2> ~ To get all coins: /api/coins </h2>
            <h2> ~ To get a specific coin: /api/coins/{coin_name} || {coin_symbol}. eg: /api/coins/btc or /api/coins/bitcoin </h2>
        `

        return res.send(html);

    } catch (error) {
        console.log(error.message);
    }
});

router.get('/api/coins', async (req, res) => {
    try {

        if (!backupCoinsArray) {
            return res.send('<h1>Coins cannot be fetched please try again...</h1>');
        }

        return res.json(backupCoinsArray);

    } catch (error) {
        console.log(error.message);
    }
});

router.get('/api/coins/:coinName', async (req, res) => {
    try {

        const coinName = req.params.coinName;


        if (!backupCoinsArray) {
            return res.send('<h1>Coins cannot be fetched please try again...</h1>');
        }

        const backupWantedCoin = backupCoinsArray.find((coin, index) => coin.name === makeFirstUpper(coinName) || coin.symbol === coinName.toUpperCase() ? coin : null);


        if (!backupWantedCoin) {
            return res.status(422).send('<h1>Sorry, couldnt find the coin you are looking for...');
        }
        
        return res.json(backupWantedCoin);

    } catch (error) {
        console.log(error.message);
    }
});

initCoinTimer(updateCoins, process.env.API_KEY_1 || process.env.API_KEY_2 ? threeMin : threeMin * 5);

module.exports = router;
