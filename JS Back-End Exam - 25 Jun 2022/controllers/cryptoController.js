let router = require('express').Router();
let cryptoService = require('../services/cryptoService');

let { isAuth } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
    let crypto = await cryptoService.getAll();
    res.render('catalog', { crypto });
});

router.get('/create-offer', isAuth, (req, res) => {
    res.render('create');
});

router.post('/create-offer', isAuth, async (req, res) => {
    let { name, image, price, description, paymentMethod } = req.body;
    let owner = req.user._id;

    try {
        await cryptoService.create(name, image, price, description, paymentMethod, owner);
        res.redirect('/crypto');
    } catch (error) {
        console.log(error);
        res.render('create', { error: error });
    }
});

router.get('/:cryptoId/details', async (req, res) => {
    let crypto = await cryptoService.getOne(req.params.cryptoId);

    let cryptoData = await crypto.toObject();
    let isOwner = cryptoData.owner.toString() === req.user?._id;

    let isBought = cryptoData.buyer.some(x => x._id.toString() == req.user?._id);

    res.render('details', { ...cryptoData, isOwner, isBought });
})

async function isOwner(req, res, next) {
    let crypto = await cryptoService.getOne(req.params.cryptoId);

    if (crypto.owner.toString() === req.user?._id) {
        res.redirect(`/crypto/${req.params.cryptoId}/details`);
    } else {
        next();
    }
}

router.get('/:cryptoId/buy', isOwner, async (req, res) => {
    let crypto = await cryptoService.getOne(req.params.cryptoId);

    crypto.buyer.push(req.user._id);
    await crypto.save();

    res.redirect(`/crypto/${req.params.cryptoId}/details`);
});

async function checkIsOwner(req, res, next) {
    let crypto = await cryptoService.getOne(req.params.cryptoId);

    if (crypto.owner == req.user._id) {
        next();
    } else {
        res.redirect(`/crypto/${req.params.cryptoId}/details`);
    }
}

router.get('/:cryptoId/delete', checkIsOwner, async (req, res) => {
    try {
        await cryptoService.delete(req.params.cryptoId);

        res.redirect('/crypto');
    } catch (error) {
        res.render('crypto/create', { error: error.message });
    }
});

router.get('/:cryptoId/edit', checkIsOwner, async (req, res) => {
    let crypto = await cryptoService.getOne(req.params.cryptoId);
    let cryptoData = await crypto.toObject();

    res.render('edit', { ...cryptoData });
});

router.post('/:cryptoId/edit', checkIsOwner, async (req, res) => {
    let { name, image, price, description, paymentMethod } = req.body;
    let _id = req.params.cryptoId;

    try {
        await cryptoService.updateOne(_id, name, image, price, description, paymentMethod);

        res.redirect(`/crypto/${req.params.cryptoId}/details`);
    } catch (error) {
        res.render('create', { error: error });
    }
});

module.exports = router;