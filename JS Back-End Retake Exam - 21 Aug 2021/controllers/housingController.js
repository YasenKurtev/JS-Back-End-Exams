let router = require('express').Router();
let housingService = require('../services/housingService');
let User = require('../models/User');

let { isAuth } = require('../middlewares/authMiddleware');

router.get('/catalog', async (req, res) => {
    let housing = await housingService.getAll();
    res.render('catalog', { housing });
});

router.get('/create', isAuth, (req, res) => {
    res.render('create');
});

router.post('/create', isAuth, async (req, res) => {
    let { name, type, year, city, image, description, availablePieces } = req.body;
    let owner = req.user._id;

    try {
        await housingService.create(name, type, year, city, image, description, availablePieces, owner);
        res.redirect('/real-estate/catalog');
    } catch (error) {
        console.log(error);
        res.render('create', { error: error });
    }
});

router.get('/:housingId/details', async (req, res) => {
    let housing = await housingService.getOne(req.params.housingId);

    let housingData = await housing.toObject();
    let isOwner = housingData.owner.toString() === req.user?._id;
    let housingOwner = await User.findById(housingData.owner.toString());
    let peopleRented = [];
    for (let id of housingData.rentedHome) {
        let user = await User.findById(id);
        peopleRented.push(user.name);
    }
    let peopleRentedJoined = peopleRented.join(', ');

    let availablePiecesFlag = housingData.availablePieces === 0 ? false : true;

    let hasRented = housingData.rentedHome.some(x => x._id.toString() == req.user?._id);

    res.render('details', { ...housingData, isOwner, housingOwner, peopleRented, peopleRentedJoined, availablePiecesFlag, hasRented });
});

async function isOwner(req, res, next) {
    let housing = await housingService.getOne(req.params.housingId);

    if (housing.owner.toString() === req.user?._id) {
        res.redirect('/');
    } else {
        next();
    }
}

router.get('/:housingId/rent', isOwner, async (req, res) => {
    let housing = await housingService.getOne(req.params.housingId);

    housing.rentedHome.push(req.user._id);
    if (housing.availablePieces > 0) {
        housing.availablePieces -= 1;
    }
    await housing.save();

    res.redirect(`/real-estate/${req.params.housingId}/details`);
});

async function checkIsOwner(req, res, next) {
    let housing = await housingService.getOne(req.params.housingId);

    if (housing.owner == req.user._id) {
        next();
    } else {
        res.redirect('/');
    }
}

router.get('/:housingId/edit', checkIsOwner, async (req, res) => {
    let housing = await housingService.getOne(req.params.housingId);
    let housingData = await housing.toObject();

    res.render('edit', { ...housingData });
});

router.post('/:housingId/edit', checkIsOwner, async (req, res) => {
    let { name, type, year, city, image, description, availablePieces } = req.body;
    let _id = req.params.housingId;

    try {
        await housingService.updateOne(_id, name, type, year, city, image, description, availablePieces);

        res.redirect(`/real-estate/${req.params.housingId}/details`);
    } catch (error) {
        res.render('edit', { error: error });
    }
});

router.get('/:housingId/delete', checkIsOwner, async (req, res) => {
    try {
        await housingService.delete(req.params.housingId);

        res.redirect('/real-estate/catalog');
    } catch (error) {
        res.render('catalog', { error: error.message });
    }
});

router.get('/search', isAuth, (req, res) => {
    res.render('search');
});

router.post('/search', isAuth, async (req, res) => {
    let { searchInput } = req.body;

    searchInput = searchInput.charAt(0).toUpperCase() + searchInput.slice(1).toLowerCase();

    let searchResult = await housingService.search(searchInput);

    res.render('search', { searchResult: searchResult });
});

module.exports = router;