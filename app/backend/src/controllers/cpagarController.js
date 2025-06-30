const db = require('../config/db');

const getContasPagar = async (req, res) => {
  try {
    const query_cpagar = 'SELECT * FROM contasPagar ORDER BY idp ASC';
    const { rows } = await db.query(query_cpagar);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Erro ao buscar contas a pagar no banco de dados:', error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};


module.exports = {
  getContasPagar
};