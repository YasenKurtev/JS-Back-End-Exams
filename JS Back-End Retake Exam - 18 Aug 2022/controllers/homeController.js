let router = require('express').Router();
let Book = require('../models/Book');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/profile/:userId', isAuth, async (req, res) => {
    let wishedList = await Book.find({ wishingList: req.params.userId }).lean();
    res.render('profile', { title: 'Profile', wishedList });
});

module.exports = router;