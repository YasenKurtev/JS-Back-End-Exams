let jwt = require('../utils/jwt');
let bcrypt = require('bcrypt');
let User = require('../models/User');
let { JWT_Secret, SALT_ROUNDS } = require('../constants');

exports.register = async ({ email, password, confirmPassword, description }) => {
    if (!email.match(/^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/)) {
        throw new Error('Invalid email!');
    }

    if (password.length < 5) {
        throw new Error('Password must be at least 5 characters long!');
    }

    if (password !== confirmPassword) {
        throw new Error('Passwrods don\'t match');
    }

    if (description.length > 40) {
        throw new Error('Description must be max 40 characters long!');
    }

    let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let createdUser = User.create({
        email: email,
        password: hashedPassword,
        description: description
    });

    return createdUser;
}

exports.login = async ({ email, password }) => {
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
        email: user.email
    }

    let token = await jwt.sign(payload, JWT_Secret);

    return token;
}