let router = require('express').Router();
let cryptoService = require('../services/cryptoService');

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/search', async (req, res) => {
    let cryptoText = req.query.text;
    let cryptoPay = req.query.paymentMethod;

    let crypto = await cryptoService.search(cryptoText, cryptoPay);

    if(crypto == undefined) {
        crypto = await cryptoService.getAll();
    }

    res.render('search', { title: 'Search Crypto', crypto })
})

module.exports = router;