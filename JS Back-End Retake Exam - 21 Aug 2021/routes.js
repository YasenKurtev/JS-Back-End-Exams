let router = require('express').Router();

let homeController = require('./controllers/homeController');
let authController = require('./controllers/authController');
let housingController = require('./controllers/housingController');

router.use('/', homeController);
router.use('/auth', authController);
router.use('/real-estate', housingController);
router.use('*', (req, res) => {
    res.render('404');
});

module.exports = router;