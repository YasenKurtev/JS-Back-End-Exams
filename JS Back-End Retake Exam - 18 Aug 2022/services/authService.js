let jwt = require('../utils/jwt');
let bcrypt = require('bcrypt');
let User = require('../models/User');
let { JWT_Secret, SALT_ROUNDS } = require('../constants');

exports.register = async (username, email, password, confirmPassword) => {
    if (email.length < 10) {
        throw new Error('Email must be at least 10 characters long!');
    }

    if (username.length < 4) {
        throw new Error('Username must be at least 4 characters long!');
    }

    if (password.length < 3) {
        throw new Error('Email must be at least 3 characters long!');
    }

    if (password !== confirmPassword) {
        throw new Error('Passwrods don\'t match');
    }

    let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let createdUser = User.create({
        username: username,
        email: email,
        password: hashedPassword
    });

    return createdUser;
}

exports.login = async (email, password) => {
    let user = await User.findOne({ email });

    if (!user) {
        throw new Error('There is no user with this email address!');
    }

    let isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid password!');
    }

    let payload = {
        _id: user._id,
        email: user.email,
        username: user.username
    }

    let token = await jwt.sign(payload, JWT_Secret);

    return token;
}