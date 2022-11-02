let router = require('express').Router();

let homeController = require('./controllers/homeController');
let authController = require('./controllers/authController');
let cryptoController = require('./controllers/cryptoController');

router.use('/', homeController);
router.use('/auth', authController);
router.use('/crypto', cryptoController);
router.use('*', (req, res) => {
    res.render('404');
});

module.exports = router;