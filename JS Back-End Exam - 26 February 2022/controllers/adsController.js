let router = require('express').Router();
let adService = require('../services/adService');
let User = require('../models/User');

let { isAuth } = require('../middlewares/authMiddleware');

router.get('/catalog', async (req, res) => {
    let ads = await adService.getAll();
    res.render('catalog', { ads });
});

router.get('/create', isAuth, (req, res) => {
    res.render('create');
});

router.post('/create', isAuth, async (req, res) => {
    let { headline, location, companyName, companyDescription } = req.body;
    let owner = req.user._id;

    try {
        await adService.create(headline, location, companyName, companyDescription, owner);
        res.redirect('/ads/catalog');
    } catch (error) {
        console.log(error);
        res.render('create', { error: error });
    }
});

router.get('/:adId/details', async (req, res) => {
    let ad = await adService.getOne(req.params.adId);

    let adData = await ad.toObject();
    let isOwner = adData.owner.toString() === req.user?._id;
    let adOwner = await User.findById(adData.owner.toString());
    let appliedUsers = [];
    adData.usersApplied.forEach(x => {
        appliedUsers.push(x);
    });

    let isApplied = adData.usersApplied.some(x => x._id.toString() == req.user?._id);

    res.render('details', { ...adData, isOwner, adOwner, appliedUsers, isApplied });
});

async function isOwner(req, res, next) {
    let ads = await adService.getOne(req.params.adId);

    if (ads.owner.toString() === req.user?._id) {
        res.redirect('/');
    } else {
        next();
    }
}

router.get('/:adId/apply', isOwner, async (req, res) => {
    let ad = await adService.getOne(req.params.adId);

    ad.usersApplied.push(req.user._id);
    await ad.save();

    res.redirect(`/ads/${req.params.adId}/details`);
});

async function checkIsOwner(req, res, next) {
    let ads = await adService.getOne(req.params.adId);

    if (ads.owner == req.user._id) {
        next();
    } else {
        res.redirect('/');
    }
}

router.get('/:adId/delete', checkIsOwner, async (req, res) => {
    try {
        await adService.delete(req.params.adId);

        res.redirect('/ads/catalog');
    } catch (error) {
        res.render('catalog', { error: error.message });
    }
});

router.get('/:adId/edit', checkIsOwner, async (req, res) => {
    let ad = await adService.getOne(req.params.adId);
    let adData = await ad.toObject();

    res.render('edit', { ...adData });
});

router.post('/:adId/edit', checkIsOwner, async (req, res) => {
    let { headline, location, companyName, companyDescription } = req.body;
    let _id = req.params.adId;

    try {
        await adService.updateOne(_id, headline, location, companyName, companyDescription);

        res.redirect(`/ads/${req.params.adId}/details`);
    } catch (error) {
        res.render('create', { error: error });
    }
});

module.exports = router;