let jwt = require('../utils/jwt');
let bcrypt = require('bcrypt');
let User = require('../models/User');
let { JWT_Secret, SALT_ROUNDS } = require('../constants');

exports.register = async (email, firstName, lastName, password, confirmPassword) => {
    if (!email.match(/^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/)) {
        throw new Error('Invalid email!');
    }

    if (firstName.length < 1) {
        throw new Error('First name must be at least 1 characters long!');
    }

    if (lastName.length < 1) {
        throw new Error('Last name must be at least 1 characters long!');
    }

    if (password.length < 5) {
        throw new Error('Password must be at least 5 characters long!');
    }

    if (password !== confirmPassword) {
        throw new Error('Passwrods don\'t match');
    }

    let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let createdUser = User.create({
        email: email,
        firstName: firstName,
        lastName: lastName,
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
        firstName: user.firstName
    }

    let token = await jwt.sign(payload, JWT_Secret);

    return token;
}