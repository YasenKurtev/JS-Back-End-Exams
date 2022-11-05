let mongoose = require('mongoose');

let adSchema = new mongoose.Schema({
    headline: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    companyDescription: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    usersApplied: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ]
});

let Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;