let Crypto = require('../models/Crypto');

exports.create = (name, image, price, description, paymentMethod, owner) => {
    if (name.length < 2) {
        throw new Error('Name must be at least 2 characters long!');
    }

    if (Number(price) < 0) {
        throw new Error('Price must be a positive number!');
    }

    if (!(image.startsWith('http://') || image.startsWith('https://'))) {
        throw new Error('Image URL must start with http or https');
    }

    if (description.length < 10) {
        throw new Error('Name must be at least 10 characters long!');
    }

    if (!(paymentMethod === 'crypto-wallet' || paymentMethod === 'credit-card' || paymentMethod === 'debit-card' || paymentMethod === 'paypal')) {
        throw new Error('Invalid payment method!');
    }

    let createdCrypto = Crypto.create({
        name: name,
        image: image,
        price: price,
        description: description,
        paymentMethod: paymentMethod,
        owner: owner
    });

    return createdCrypto;
}

exports.getAll = () => Crypto.find().lean();

exports.getOne = (cryptoId) => Crypto.findById(cryptoId).populate('buyer');

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);

exports.updateOne = (cryptoId, name, image, price, description, paymentMethod, owner) => {
    if (name.length < 2) {
        throw new Error('Name must be at least 2 characters long!');
    }

    if (Number(price) < 0) {
        throw new Error('Price must be a positive number!');
    }

    if (!(image.startsWith('http://') || image.startsWith('https://'))) {
        throw new Error('Image URL must start with http or https');
    }

    if (description.length < 10) {
        throw new Error('Name must be at least 10 characters long!');
    }

    if (!(paymentMethod === 'crypto-wallet' || paymentMethod === 'credit-card' || paymentMethod === 'debit-card' || paymentMethod === 'paypal')) {
        throw new Error('Invalid payment method!');
    }

    let updatedCrypto = Crypto.findByIdAndUpdate(cryptoId, {
        name: name,
        image: image,
        price: price,
        description: description,
        paymentMethod: paymentMethod
    });

    return updatedCrypto;
}

exports.search = (cryptoText, paymentMethod) => {
    if (!cryptoText && paymentMethod) {
        return (Crypto.find({ paymentMethod: paymentMethod }).lean());
    }

    if (cryptoText && paymentMethod) {
        return (Crypto.find({ name: { $regex: cryptoText, $options: 'i' }, paymentMethod: paymentMethod }).lean());
    }
}