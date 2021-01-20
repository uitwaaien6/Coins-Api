"use strict";

const mongoose = require('mongoose');
const Coins = mongoose.model('Coins');
const express = require('express');
const axios = require('axios');

const router = express.Router();

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
    return word[0].toUpperCase() + word.substr(1, word.length);
}

async function updateCoins() {

    try {

        switch (apiKeyIndex) {
            case 0:
                currentApiKey = process.env.API_KEY_0 ? process.env.API_KEY_0 : '';
                increaseApiKeyIndex();
                break;
            case 1:
                currentApiKey = process.env.API_KEY_1 ? process.env.API_KEY_1 : '';
                increaseApiKeyIndex();
                break;
            case 2:
                currentApiKey = process.env.API_KEY_2 ? process.env.API_KEY_2 : '';
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

        const existingCoins = await Coins.findOne();
        
        if (!existingCoins) {
            const initialCoins = new Coins({ coins: data });
            await initialCoins.save();
        }

        await Coins.updateOne({ coins: data });

    } catch (error) {
        console.log(error.message);
    }

}

router.get('/api/coins', async (req, res) => {
    try {

        const existingCoins = await Coins.findOne();

        if (!existingCoins) {
            return res.send('<h1>Coins cannot be fetched please try again...</h1>');
        }

        const coins = existingCoins.coins;

        return res.json(coins);

    } catch (error) {
        console.log(error.message);
    }
});

router.get('/api/coins/:coinName', async (req, res) => {
    try {

        const coinName = req.params.coinName;

        const existingCoins = await Coins.findOne();

        if (!existingCoins) {
            return res.send('<h1>Coins cannot be fetched please try again...</h1>');
        }

        const coins = existingCoins.coins;

        const wantedCoin = coins.find((coin, index) => coin.name === makeFirstUpper(coinName) || coin.symbol === coinName.toUpperCase() ? coin : null);

        if (!wantedCoin) {
            return res.status(422).send('<h1>Sorry, couldnt find the coin you are looking for...');
        }
        
        return res.json(wantedCoin);

    } catch (error) {
        console.log(error.message);
    }
});

initCoinTimer(updateCoins, threeMin);

module.exports = router;
