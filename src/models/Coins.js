const mongoose = require('mongoose');

const coinSchema = mongoose.Schema({
    name: {
        type: String
    },
    symbol: {
        type: String
    },
    cmc_rank: {
        type: String
    },
    max_supply: {
        type: String
    },
    quote: {
        type: Object
    }
});

const coinsSchema = mongoose.Schema({
    coins: [coinSchema]
});



mongoose.model('Coins', coinsSchema);
