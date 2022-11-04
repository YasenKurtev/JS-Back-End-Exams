let Auction = require('../models/Auction');

exports.create = (title, category, image, price, description, owner) => {
    if (title.length < 4) {
        throw new Error('Title must be at least 4 characters long!');
    }

    if (!(category === 'vehicles' || category === 'estate' || category === 'electronics' || category === 'furniture' || category === 'other')) {
        throw new Error('Invalid category!');
    }

    if (price < 0) {
        throw new Error('Price must be a positive number!');
    }

    if (description.length > 200) {
        throw new Error('Description must be max 200 characters long!');
    }

    let createdAuction = Auction.create({
        title: title,
        category: category,
        image: image,
        price: price,
        description: description,
        owner: owner
    });

    return createdAuction;
}

exports.getAll = () => Auction.find().lean();

exports.getOne = (auctionId) => Auction.findById(auctionId).populate('bidder');

exports.placeBid = async (auctionId, currentBid, userId) => {
    let auction = await Auction.findById(auctionId);

    if (auction.bidder == userId) {
        throw new Error('You are the current highest bidder!');
    }

    if (auction.price >= currentBid) {
        throw new Error('Your bid must be larger than the current price!');
    }

    auction.bidder = userId;
    auction.price = currentBid;

    await auction.save();
}

exports.updateOne = (auctionId, title, category, image, price, description) => {
    if (title.length < 4) {
        throw new Error('Title must be at least 4 characters long!');
    }

    if (!(category === 'vehicles' || category === 'estate' || category === 'electronics' || category === 'furniture' || category === 'other')) {
        throw new Error('Invalid category!');
    }

    if (price < 0) {
        throw new Error('Price must be a positive number!');
    }

    if (description.length > 200) {
        throw new Error('Description must be max 200 characters long!');
    }

    let updatedAuction = Auction.findByIdAndUpdate(auctionId, {
        title: title,
        category: category,
        image: image,
        price: price,
        description: description
    });

    return updatedAuction;
}

exports.delete = (auctionId) => Auction.findByIdAndDelete(auctionId);