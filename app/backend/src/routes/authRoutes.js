const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ success: true, message: 'Login realizado com sucesso!', user: req.user });
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.json({ success: true, message: "Logout realizado com sucesso." });
    });
});

router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ loggedIn: true, user: req.user });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports=router;