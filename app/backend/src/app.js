const express = require("express");
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// O require das rotas vem primeiro
const clienteRoutes = require('./routes/clienteRoutes');
const cpagarRoutes = require('./routes/cpagarRoutes');
const creceberRoutes = require('./routes/creceberRoutes');
console.log("1. [App] Conteúdo importado de creceberRoutes:", creceberRoutes);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'src', 'pages')));

app.use('/api/clientes', clienteRoutes);
app.use('/api/contasPagar', cpagarRoutes);
app.use('/api/contasReceber', creceberRoutes);

app.get('/', (req, res) => {
  // Redireciona o usuário para a sua página home existente
  res.redirect('/home/index.html');
});



// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}.`);
});