let express = require('express');
let cookieParser = require('cookie-parser');
const { session } = require('../middlewares/authMiddleware');

function expressConfig(app) {
    app.locals.title = 'Auction House';
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session);
}

module.exports = expressConfig;