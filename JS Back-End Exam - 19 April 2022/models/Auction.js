let mongoose = require('mongoose');

let auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    bidder: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }

});

let Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;