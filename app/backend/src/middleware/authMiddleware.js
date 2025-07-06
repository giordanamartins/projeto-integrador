function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // se logado, continua
    }
    // se não, não autorizado
    res.redirect('/login/index.html');
}

module.exports = isAuthenticated;