function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    
    if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
        return res.status(401).json({ message: 'Sessão expirada ou acesso não autorizado. Por favor, faça o login novamente.' });
    } else {
        res.redirect('/login/index.html');
    }
}


module.exports = isAuthenticated;