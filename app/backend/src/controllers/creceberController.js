console.log("3. [Controller] Lendo o arquivo creceberController.js...");
const db = require('../config/db');

const getContasReceber = async (req, res) => {
  try {
    const query_creceber = 'SELECT cl.nome, cr.descricaor, datavencr, totalr FROM contasReceber cr JOIN clientes cl on cr.idc=cl.idc;';
    const { rows } = await db.query(query_creceber);
    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const getContasReceberHoje = async (req, res) => {
  try{
    const query_creceber = 'SELECT cr.totalr FROM contasReceber cr JOIN clientes cl ON cr.idc=cl.idc WHERE cr.datavencr = CURRENT_DATE;';
    const { rows } = await db.query(query_creceber);
    res.status(200).json(rows);
  }catch (error) {
        console.error('Erro ao buscar contas a receber do dia:', error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};


module.exports = {
  getContasReceber,
  getContasReceberHoje
};