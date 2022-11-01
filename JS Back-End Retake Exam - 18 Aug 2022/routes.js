let router = require('express').Router();

let homeController = require('./controllers/homeController');
let authController = require('./controllers/authController');
let bookController = require('./controllers/bookController');

router.use('/', homeController);
router.use('/auth', authController);
router.use('/books', bookController);
router.use('*', (req, res) => {
    res.render('404');
});

module.exports = router;