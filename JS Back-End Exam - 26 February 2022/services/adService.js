let Ad = require('../models/Ad');

exports.getAll = () => Ad.find().lean();

exports.getOne = (adId) => Ad.findById(adId).populate('usersApplied');

exports.delete = (adId) => Ad.findByIdAndDelete(adId);

exports.create = (headline, location, companyName, companyDescription, owner) => {
    if (headline.length < 4) {
        throw new Error('Headline must be at least 4 characters long!');
    }

    if (location.length < 8) {
        throw new Error('Location must be at least 8 characters long!');
    }

    if (companyName.length < 3) {
        throw new Error('Company name must be at least 3 characters long!');
    }

    if (companyDescription.length > 40) {
        throw new Error('Company description must be max 40 characters long!');
    }

    let createdAd = Ad.create({
        headline: headline,
        location: location,
        companyName: companyName,
        companyDescription: companyDescription,
        owner: owner
    });

    return createdAd;
}

exports.updateOne = (adId, headline, location, companyName, companyDescription) => {
    if (headline.length < 4) {
        throw new Error('Headline must be at least 4 characters long!');
    }

    if (location.length < 8) {
        throw new Error('Location must be at least 8 characters long!');
    }

    if (companyName.length < 3) {
        throw new Error('Company name must be at least 3 characters long!');
    }

    if (companyDescription.length > 40) {
        throw new Error('Company description must be max 40 characters long!');
    }

    let updatedAd = Ad.findByIdAndUpdate(adId, {
        headline: headline,
        location: location,
        companyName: companyName,
        companyDescription: companyDescription
    });

    return updatedAd;
}