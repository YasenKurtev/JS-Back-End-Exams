let router = require('express').Router();

let homeController = require('./controllers/homeController');
let authController = require('./controllers/authController');
let adsController = require('./controllers/adsController');

router.use('/', homeController);
router.use('/auth', authController);
router.use('/ads', adsController);
router.use('*', (req, res) => {
    res.render('404');
});

module.exports = router;