let router = require('express').Router();

let homeController = require('./controllers/homeController');
let authController = require('./controllers/authController');
let auctionController = require('./controllers/auctionController');

router.use('/', homeController);
router.use('/auth', authController);
router.use('/auction', auctionController);
router.use('*', (req, res) => {
    res.render('404');
});

module.exports = router;