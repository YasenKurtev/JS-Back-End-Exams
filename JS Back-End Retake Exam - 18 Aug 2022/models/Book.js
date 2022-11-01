let mongoose = require('mongoose');

let bookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    author: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    wishingList: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ]
});

let Book = mongoose.model('Book', bookSchema);

module.exports = Book;