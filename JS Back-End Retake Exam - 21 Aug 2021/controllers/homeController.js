let router = require('express').Router();
let housingService = require('../services/housingService');

router.get('/', async (req, res) => {
    let housing = await (await housingService.getAll()).reverse().slice(0, 3);
    res.render('home', { housing });
});

module.exports = router;