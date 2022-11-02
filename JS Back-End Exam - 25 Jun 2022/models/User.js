let { Schema, model } = require('mongoose');

let userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

let User = model('User', userSchema);

module.exports = User;