require('dotenv').config();
const express = require("express");
const cors = require('cors');
const path = require('path');
const session = require("express-session");
const passport = require("passport");
const db = require('./config/db');

//autenticacao
const initializePassport = require('./config/passport-cfg');
initializePassport(passport);

// require das rotas
const catDespesaRoutes = require('./routes/catDespesaRoutes');
const catProcessosRoutes = require('./routes/catProcessosRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const cpagarRoutes = require('./routes/cpagarRoutes');
const creceberRoutes = require('./routes/creceberRoutes');
const modelosRoutes = require('./routes/modelosRoutes');
const processosRoutes = require('./routes/processosRoutes');
const tarefasRoutes = require('./routes/tarefasRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const isAuthenticated = require('./middleware/authMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //1 dia!!
  }
}));

app.use(passport.initialize());
app.use(passport.session());


const primeiroUsuario = async (req, res, next) => {
    try {
        const userCheck = await db.query('SELECT COUNT(*) AS user_count FROM usuarios');
        const userCount = parseInt(userCheck.rows[0].user_count, 10);

        if (userCount === 0 && req.method === 'POST' && req.path === '/') {
            return next();
        }
        
        return isAuthenticated(req, res, next);

    } catch (error) {
        console.error("Erro ao verificar primeiro usuário:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};


app.get('/', async (req, res) => {
  try {
    const userCheck = await db.query('SELECT COUNT(*) AS user_count FROM usuarios');
    const userCount = parseInt(userCheck.rows[0].user_count, 10);

    if (userCount === 0) {

      return res.redirect('/usuarios/index.html');
    }

    if (req.isAuthenticated()) {
      res.redirect('/home/index.html');
    } else {
      res.redirect('/login/index.html');
    }

  } catch (error) {
    console.error("Erro na verificação do primeiro usuário:", error);
    res.status(500).send("Ocorreu um erro ao iniciar a aplicação.");
  }
});


app.get('/home/index.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'src', 'pages', 'home', 'index.html'));
});

app.use('/api/auth', authRoutes);

app.use('/api/usuarios', primeiroUsuario, usuarioRoutes);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'src', 'pages')));



app.use('/api/catDespesas', isAuthenticated, catDespesaRoutes);
app.use('/api/catProcessos',isAuthenticated, catProcessosRoutes);
app.use('/api/clientes',isAuthenticated, clienteRoutes);
app.use('/api/contasPagar', isAuthenticated, cpagarRoutes);
app.use('/api/contasReceber', isAuthenticated, creceberRoutes);
app.use('/api/processos', isAuthenticated, processosRoutes);
app.use('/api/tarefas', isAuthenticated, tarefasRoutes);
app.use('/api/usuarios', isAuthenticated, usuarioRoutes);
app.use('/api/modelos', isAuthenticated, modelosRoutes);


// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}.`);
});
//