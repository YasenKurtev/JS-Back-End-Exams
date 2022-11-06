let Housing = require('../models/Housing');

exports.getAll = () => Housing.find().lean();

exports.getOne = (housingId) => Housing.findById(housingId).populate('rentedHome');

exports.delete = (housingId) => Housing.findByIdAndDelete(housingId);

exports.create = (name, type, year, city, image, description, availablePieces, owner) => {
    if (name.length < 6) {
        throw new Error('Name must be at least 6 characters long!');
    }

    if (!(type === 'Apartment' || type === 'Villa' || type === 'House')) {
        throw new Error('Invalid type!');
    }

    if (year < 1850 || year > 2021) {
        throw new Error('Year out of range!');
    }

    if (city.length < 4) {
        throw new Error('City must be at least 4 characters long!');
    }

    if (!(image.startsWith('http://') || image.startsWith('https://'))) {
        throw new Error('Image URL must start with http or https');
    }

    if (description.length > 60) {
        throw new Error('Description must be max 60 characters long!');
    }

    if (availablePieces < 0 || availablePieces > 10) {
        throw new Error('Available pieces out of range!');
    }

    let createdHousing = Housing.create({
        name: name,
        type: type,
        year: year,
        city: city,
        image: image,
        description: description,
        availablePieces: availablePieces,
        owner: owner
    });

    return createdHousing;
}

exports.updateOne = (housingId, name, type, year, city, image, description, availablePieces) => {
    if (name.length < 6) {
        throw new Error('Name must be at least 6 characters long!');
    }

    if (!(type === 'Apartment' || type === 'Villa' || type === 'House')) {
        throw new Error('Invalid type!');
    }

    if (year < 1850 || year > 2021) {
        throw new Error('Year out of range!');
    }

    if (city.length < 4) {
        throw new Error('City must be at least 4 characters long!');
    }

    if (!(image.startsWith('http://') || image.startsWith('https://'))) {
        throw new Error('Image URL must start with http or https');
    }

    if (description.length > 60) {
        throw new Error('Description must be max 60 characters long!');
    }

    if (availablePieces < 0 || availablePieces > 10) {
        throw new Error('Available pieces out of range!');
    }

    let createdHousing = Housing.findByIdAndUpdate(housingId, {
        name: name,
        type: type,
        year: year,
        city: city,
        image: image,
        description: description,
        availablePieces: availablePieces
    });

    return createdHousing;
}

exports.search = (searchInput) => Housing.find({ type: searchInput }).lean();