console.log("3. [Controller] Lendo o arquivo creceberController.js...");
const db = require('../config/db');

const getContasReceber = async (req, res) => {
  try {
    const query_creceber = 'SELECT cl.nome, cr.descricao, cr.data_vencimento, cr.valor FROM a_receber cr JOIN clientes cl on cr.cliente_codigo = cl.codigo;';
    const { rows } = await db.query(query_creceber);
    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const getContasReceberHoje = async (req, res) => {
  try{
    const query_creceber = 'SELECT cr.valor FROM a_receber cr JOIN clientes cl on cr.cliente_codigo = cl.codigo WHERE cr.data_vencimento = CURRENT_DATE;';
    const { rows } = await db.query(query_creceber);
    res.status(200).json(rows);
  }catch (error) {
        console.error('Erro ao buscar contas a receber do dia:', error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const createContasReceber = async (req, res) => {
  const { valor, data_vencimento, status, descricao, recorrencia, cliente_codigo, processo_codigo } = req.body;

  try{
    const queryText = 'INSERT INTO a_receber (valor, data_vencimento, status, descricao, recorrencia, cliente_codigo, processo_codigo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;';
    const values = [valor, data_vencimento, status, descricao, recorrencia, cliente_codigo, processo_codigo];

    const { rows } = await db.query(queryText, values);
          
            res.status(201).json({ message: 'Contas a receber criado com sucesso!', creceber: rows[0] });
  }
  catch(err){
      console.error('Erro ao inserir contas a receber:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

const updateContasReceber = async (req, res) => {
    const { id } = req.params;

    const contaExiste = await db.oneOrNone("SELECT id FROM a_receber WHERE codigo = $1;", [id]);
    if (!contaExiste) {
      return res.status(404).send({ error: 'Conta não encontrada.' });
    }

    try {
      const { valor, data_vencimento, status, descricao, recorrencia, cliente_codigo, processo_codigo } = req.body;
      
      await db.none(
        'UPDATE a_receber SET valor = $1, data_vencimento = $2, status = $3, descricao = $4, recorrencia = $5, cliente_codigo = $6, processo_codigo = $7  WHERE codigo = $8;'
        [valor, data_vencimento, status, descricao, recorrencia, cliente_codigo, processo_codigo, id]
      );
      
      return res.status(200).send("Contas a receber atualizado com sucesso!");
    } 
    catch (err) {
      return res.status(400).send({ error: 'Erro ao atualizar conta.', details: err.message });
    }
}

const deleteContasReceber = async (req, res) => {
  const {ids} = req.body;
  
      if (!ids || ids.length === 0) {
          return res.status(400).json({ message: 'Nenhum ID de conta foi fornecido para exclusão.' });
      }
      const idInt = ids.map(id => parseInt(id, 10));
  
      console.log("Array convertido para inteiros:", idInt);
  
      try {
          const queryText = 'DELETE FROM a_receber WHERE codigo = ANY($1::int[])';
          
          const result = await db.query(queryText, [idInt]);
      
          // result.rowCount contém o número de linhas que foram deletadas
          res.status(200).json({ message: `${result.rowCount} conta(s) excluída(s) com sucesso.` });
          } 
          catch (error) {
              console.error('Erro ao excluir conta:', error);
              res.status(500).json({ message: 'Erro interno do servidor.' });
          }
}

const relatorioContasAReceber = async (req, res) => {
  try {
    const query = `
      SELECT
        ar.codigo,
        c.nome AS cliente,
        p.descricao AS processo,
        ar.descricao,
        ar.data_vencimento,
        ar.valor
      FROM a_receber ar
      JOIN clientes c ON ar.cliente_codigo = c.codigo
      JOIN processos p ON ar.processo_codigo = p.codigo
      WHERE ar.status = 'A'
      ORDER BY ar.data_vencimento;
    `;
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro no relatório de contas a receber:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const relatorioRecebimentos = async (req, res) => {
  try {
    const query = `
      SELECT
        ar.codigo,
        c.nome AS cliente,
        p.descricao AS processo,
        ar.descricao,
        ar.data_vencimento,
        ar.valor
      FROM a_receber ar
      JOIN clientes c ON ar.cliente_codigo = c.codigo
      JOIN processos p ON ar.processo_codigo = p.codigo
      WHERE ar.status = 'R'
      ORDER BY ar.data_vencimento;
    `;
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro no relatório de recebimentos:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  getContasReceber,
  getContasReceberHoje,
  createContasReceber,
  updateContasReceber,
  deleteContasReceber,
  relatorioContasAReceber,
  relatorioRecebimentos
};
