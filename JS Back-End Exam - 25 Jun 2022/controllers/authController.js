let router = require('express').Router();
let authService = require('../services/authService');
let { isAuth, isGuest } = require('../middlewares/authMiddleware');
let { AUTH_COOKIE_NAME } = require('../constants');

router.get('/login', isGuest, (req, res) => {
    res.render('login', { title: 'Login Page' });
});

router.post('/login', isGuest, async (req, res) => {
    let { email, password } = req.body;

    console.log(req.body);

    try {
        let token = await authService.login({ email, password });

        res.cookie(AUTH_COOKIE_NAME, token);

        res.redirect('/');
    } catch (error) {
        res.render('login', { error: error.message });
    }
});

router.get('/register', isGuest, (req, res) => {
    res.render('register', { title: 'Register Page' });
});

router.post('/register', isGuest, async (req, res) => {
    let { username, email, password, confirmPassword } = req.body;

    console.log(req.body);

    try {
        await authService.register({
            username,
            email,
            password,
            confirmPassword
        });

        let token = await authService.login({ email, password });

        res.cookie(AUTH_COOKIE_NAME, token);

        res.redirect('/');
    } catch (error) {
        res.render('register', { error: error.message });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.redirect('/');
});

module.exports = router;