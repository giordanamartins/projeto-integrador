const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

function auth(passport) {
    const autenticarUser = async (email, senha, done) => {
        try {

            const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                return done(null, false, { message: 'Nenhum usuário com este e-mail foi encontrado.' });
            }

            const senhasBatem = await bcrypt.compare(senha, user.senha);

            if (senhasBatem) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Senha incorreta.' });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'senha' }, autenticarUser));


    passport.serializeUser((user, done) => done(null, user.codigo));

    passport.deserializeUser(async (id, done) => {
        try {
            const result = await db.query('SELECT * FROM usuarios WHERE codigo = $1', [id]);
            return done(null, result.rows[0]);
        } catch (error) {
            return done(error);
        }
    });
}

module.exports = auth;
