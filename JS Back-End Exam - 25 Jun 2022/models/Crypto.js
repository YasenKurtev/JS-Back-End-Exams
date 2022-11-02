let mongoose = require('mongoose');

let cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    paymentMethod: {
        type: String,
        require: true,
        enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal']
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    buyer: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ]
});

let Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;