let Book = require('../models/Book');

exports.create = (title, author, image, review, genre, stars, owner) => {
    if (title.length < 2) {
        throw new Error('Title must be at least 2 characters long!');
    }

    if (author.length < 5) {
        throw new Error('Author must be at least 5 characters long!');
    }

    if (genre.length < 3) {
        throw new Error('Genre must be at least 3 characters long!');
    }

    if (stars < 1 || stars > 5) {
        throw new Error('Stars out of range!');
    }

    if (!(image.startsWith('http://') || image.startsWith('https://'))) {
        throw new Error('Image URL must start with http or https');
    }

    if (review.length < 10) {
        throw new Error('Review must be at least 10 characters long!');
    }

    let createdBook = Book.create({
        title: title,
        author: author,
        image: image,
        review: review,
        genre: genre,
        stars: stars,
        owner: owner
    });

    return createdBook;
}

exports.getAll = () => Book.find().lean();

exports.getOne = (BookId) => Book.findById(BookId).populate('wishingList');

exports.delete = (BookId) => Book.findByIdAndDelete(BookId);

exports.updateOne = (bookId, title, author, image, review, genre, stars) => {
    if (title.length < 2) {
        throw new Error('Title must be at least 2 characters long!');
    }

    if (author.length < 5) {
        throw new Error('Author must be at least 2 characters long!');
    }

    if (!(image.startsWith('http://') || image.startsWith('https://'))) {
        throw new Error('Image URL must start with http or https');
    }

    if (review.length < 10) {
        throw new Error('Review must be at least 10 characters long!');
    }

    if (genre.length < 3) {
        throw new Error('Genre must be at least 3 characters long!');
    }

    if (stars < 1 || stars > 5) {
        throw new Error('Stars out of range!');
    }

    let updatedBook = Book.findByIdAndUpdate(bookId, {
        title: title,
        author: author,
        image: image,
        review: review,
        genre: genre,
        stars: stars
    });

    return updatedBook;
}