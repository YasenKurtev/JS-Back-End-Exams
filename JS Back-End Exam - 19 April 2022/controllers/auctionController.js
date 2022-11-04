let router = require('express').Router();
let auctionService = require('../services/auctionService');
let User = require('../models/User');

let { isAuth } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
    let auction = await auctionService.getAll();
    res.render('browse', { auction });
});

router.get('/create', isAuth, (req, res) => {
    res.render('create');
});

router.post('/create', isAuth, async (req, res) => {
    let { title, category, image, price, description } = req.body;
    let owner = req.user._id;

    try {
        await auctionService.create(title, category, image, price, description, owner);
        res.redirect('/auction');
    } catch (error) {
        console.log(error);
        res.render('create', { error: error });
    }
});

router.get('/:auctionId/details', async (req, res) => {
    let auction = await auctionService.getOne(req.params.auctionId);

    let auctionData = await auction.toObject();
    let isOwner = auctionData.owner.toString() === req.user?._id;

    let isBidder = auctionData.bidder?._id.toString() == req.user?._id;
    let hasBidder = await User.findById(auctionData.bidder?._id);
    hasBidder ? { firstName, lastName } = hasBidder : { firstName: null, lastName: null };

    if (isOwner) {
        res.render('details-owner', { ...auctionData, hasBidder, firstName, lastName });
    } else {
        res.render('details', { ...auctionData, isBidder });
    }
});

async function isOwner(req, res, next) {
    let auction = await auctionService.getOne(req.params.auctionId);

    if (auction.owner.toString() === req.user?._id) {
        res.redirect(`/auction/${req.params.auctionId}/details`);
    } else {
        next();
    }
}

router.post('/:auctionId/bid', isOwner, async (req, res) => {
    let auction = await auctionService.getOne(req.params.auctionId);

    let auctionData = await auction.toObject();

    try {
        await auctionService.placeBid(req.params.auctionId, req.body.price, req.user._id);
        res.redirect(`/auction/${req.params.auctionId}/details`);
    } catch (error) {
        res.render('details', { ...auctionData, error: error });
    }
});

async function checkIsOwner(req, res, next) {
    let auction = await auctionService.getOne(req.params.auctionId);

    if (auction.owner == req.user._id) {
        next();
    } else {
        res.redirect(`/auction/${req.params.auctionId}/details`);
    }
}

router.get('/:auctionId/edit', checkIsOwner, async (req, res) => {
    let auction = await auctionService.getOne(req.params.auctionId);
    let auctionData = await auction.toObject();

    let hasBidder = await User.findById(auctionData.bidder?._id);

    res.render('edit', { ...auctionData, hasBidder });
});

router.post('/:auctionId/edit', checkIsOwner, async (req, res) => {
    let { title, category, image, price, description } = req.body;
    let _id = req.params.auctionId;

    try {
        await auctionService.updateOne(_id, title, category, image, price, description);

        res.redirect(`/auction/${req.params.auctionId}/details`);
    } catch (error) {
        res.render('details', { error: error });
    }
});

router.get('/:auctionId/delete', checkIsOwner, async (req, res) => {
    try {
        await auctionService.delete(req.params.auctionId);

        res.redirect('/auction');
    } catch (error) {
        res.render('catalog', { error: error.message });
    }
});

module.exports = router;