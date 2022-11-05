let jwt = require('../utils/jwt');

let { AUTH_COOKIE_NAME, JWT_Secret } = require('../constants');

exports.session = function (req, res, next) {
    let token = req.cookies[AUTH_COOKIE_NAME];

    if (token) {
        jwt.verify(token, JWT_Secret)
            .then(decodedToken => {
                req.user = decodedToken;
                res.locals.user = decodedToken;
                next();
            })
            .catch(error => {
                console.log(error);
                res.clearCookie(AUTH_COOKIE_NAME);
                res.redirect('/auth/login');
            })
    } else {
        next();
    }
}

exports.isAuth = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.render('login');
    }
}

exports.isGuest = function (req, res, next) {
    if (!req.user) {
        next();
    } else {
        res.redirect('/');
    }
}