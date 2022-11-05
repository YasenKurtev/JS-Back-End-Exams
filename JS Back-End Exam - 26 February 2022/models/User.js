let { Schema, model, default: mongoose } = require('mongoose');

let userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    myAds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ad'
    }]
});

let User = model('User', userSchema);

module.exports = User;