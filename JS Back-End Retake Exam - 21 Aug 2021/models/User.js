let { Schema, model, default: mongoose } = require('mongoose');

let userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

let User = model('User', userSchema);

module.exports = User;