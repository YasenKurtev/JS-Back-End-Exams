let jwt = require('../utils/jwt');
let bcrypt = require('bcrypt');
let User = require('../models/User');
let { JWT_Secret, SALT_ROUNDS } = require('../constants');

exports.register = async ({ name, username, password, confirmPassword }) => {
    if (!name.match(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/)) {
        throw new Error('Invalid name!');
    }

    if (username.length < 5) {
        throw new Error('Username must be at least 5 characters long!');
    }

    if (password.length < 4) {
        throw new Error('Passwrod must be at least 4 characters long!');
    }

    if (password !== confirmPassword) {
        throw new Error('Passwrods don\'t match');
    }

    let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let createdUser = User.create({
        name: name,
        username: username,
        password: hashedPassword
    });

    return createdUser;
}

exports.login = async ({ username, password }) => {
    let user = await User.findOne({ username });

    if (!user) {
        throw new Error('There is no user with this email address!');
    }

    let isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid password!');
    }

    let payload = {
        _id: user._id,
        username: user.username
    }

    let token = await jwt.sign(payload, JWT_Secret);

    return token;
}