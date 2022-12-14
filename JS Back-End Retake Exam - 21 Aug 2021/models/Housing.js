let mongoose = require('mongoose');

let housingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Apartment', 'Villa', 'House']
    },
    year: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    availablePieces: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    rentedHome: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ]
});

let Housing = mongoose.model('Housing', housingSchema);

module.exports = Housing;