let router = require('express').Router();
let bookService = require('../services/bookService');

let { isAuth } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
    let books = await bookService.getAll();
    console.log(books);
    res.render('catalog', { books });
});

router.get('/create', isAuth, (req, res) => {
    res.render('create');
});

router.post('/create', isAuth, async (req, res) => {
    let { title, author, image, review, genre, stars } = req.body;
    let owner = req.user._id;

    try {
        await bookService.create(title, author, image, review, genre, stars, owner);
        res.redirect('/books');
    } catch (error) {
        console.log(error);
        res.render('create', { error: error });
    }
});

router.get('/:bookId/details', async (req, res) => {
    let book = await bookService.getOne(req.params.bookId);

    let bookData = await book.toObject();
    let isOwner = bookData.owner.toString() === req.user?._id;

    let isListed = bookData.wishingList.some(x => x._id.toString() == req.user?._id);

    res.render('details', { ...bookData, isOwner, isListed });
});

async function isOwner(req, res, next) {
    let book = await bookService.getOne(req.params.bookId);

    if (book.owner.toString() === req.user?._id) {
        res.redirect(`/books/${req.params.bookId}/details`);
    } else {
        next();
    }
}

router.get('/:bookId/list', isOwner, async (req, res) => {
    let book = await bookService.getOne(req.params.bookId);

    book.wishingList.push(req.user._id);
    await book.save();

    res.redirect(`/books/${req.params.bookId}/details`);
});

async function checkIsOwner(req, res, next) {
    let book = await bookService.getOne(req.params.bookId);

    if (book.owner == req.user._id) {
        next();
    } else {
        res.redirect(`/books/${req.params.bookId}/details`);
    }
}

router.get('/:bookId/delete', checkIsOwner, async (req, res) => {
    try {
        await bookService.delete(req.params.bookId);

        res.redirect('/books');
    } catch (error) {
        res.render('catalog', { error: error.message });
    }
});

router.get('/:bookId/edit', checkIsOwner, async (req, res) => {
    let book = await bookService.getOne(req.params.bookId);
    let bookData = await book.toObject();

    res.render('edit', { ...bookData });
});

router.post('/:bookId/edit', checkIsOwner, async (req, res) => {
    let { title, author, image, review, genre, stars } = req.body;
    let _id = req.params.bookId;

    try {
        await bookService.updateOne(_id, title, author, image, review, genre, stars);

        res.redirect(`/books/${req.params.bookId}/details`);
    } catch (error) {
        res.render(`/books/${req.params.bookId}/details`, { error: error });
    }
});

module.exports = router;