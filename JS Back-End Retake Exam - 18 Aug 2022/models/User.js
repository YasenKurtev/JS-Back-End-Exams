let { Schema, model } = require('mongoose');

let userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
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