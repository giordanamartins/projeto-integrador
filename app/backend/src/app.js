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

// O require das rotas vem primeiro
const catDespesaRoutes = require('./routes/catDespesaRoutes');
const catProcessosRoutes = require('./routes/catProcessoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const cpagarRoutes = require('./routes/cpagarRoutes');
const creceberRoutes = require('./routes/creceberRoutes');
const processosRoutes = require('./routes/processosRoutes');
const tarefasRoutes = require('./routes/tarefasRoutes');
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

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'src', 'pages')));

app.use('/api/catDespesas', catDespesaRoutes);
app.use('/api/catProcessos', catProcessosRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/contasPagar', cpagarRoutes);
app.use('/api/contasReceber', creceberRoutes);
app.use('/api/processos', processosRoutes);
app.use('/api/tarefas', tarefasRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}.`);
});
