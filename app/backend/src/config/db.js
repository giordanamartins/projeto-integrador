const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados PostgreSQL', err.stack);
    } else {
        console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso.');
    }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};