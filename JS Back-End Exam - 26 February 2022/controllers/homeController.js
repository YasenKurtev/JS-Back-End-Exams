let router = require('express').Router();
let adService = require('../services/adService');

router.get('/', async (req, res) => {
    let ads = await (await adService.getAll()).slice(0, 3);
    res.render('home', { ads });
});



module.exports = router;