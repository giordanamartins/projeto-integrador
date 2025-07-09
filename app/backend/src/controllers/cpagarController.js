const db = require('../config/db');

const getContasPagar = async (req, res) => {
  try {
    const query_cpagar = 'SELECT cp.valor, cp.data_vencimento, cp.status, cp.descricao, cd.descricao FROM a_pagar cp JOIN categorias_despesa cd on cp.categoria_codigo = cd.codigo ORDER BY cp.data_vencimento ASC;';
    const { rows } = await db.query(query_cpagar);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Erro ao buscar contas a pagar no banco de dados:', error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const getContasPagarHoje = async (req, res) => {
  try{
    const query_cpagar = 'SELECT cp.valor, cp.data_vencimento, cp.status, cp.descricao, cd.descricao FROM a_pagar cp JOIN categorias_despesa cd on cp.categoria_codigo = cd.codigo WHERE data_vencimento = CURRENT_DATE ORDER BY cp.data_vencimento ASC;';
    const { rows } = await db.query(query_cpagar);
    res.status(200).json(rows);
  }catch (error) {
        console.error('Erro ao buscar contas a pagar do dia:', error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const createContasPagar = async (req, res) => {
  const { valor, data_vencimento, status, descricao, categoria_codigo } = req.body;

  try{
    const queryText = 'INSERT INTO a_pagar (valor, data_vencimento, status, descricao, categoria_codigo) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
    const values = [valor, data_vencimento, status, descricao, categoria_codigo];

    const { rows } = await db.query(queryText, values);
          
            res.status(201).json({ message: 'Contas a pagar criado com sucesso!', cliente: rows[0] });
  }
  catch(err){
      console.error('Erro ao inserir contas a pagar:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

const updateContasPagar = async (req, res) => {
    const { id } = req.params;

    const contaExiste = await db.oneOrNone("SELECT id FROM a_pagar WHERE codigo = $1;", [id]);
    if (!contaExiste) {
      return res.status(404).send({ error: 'Conta não encontrada.' });
    }

    try {
      const { valor, data_vencimento, status, descricao, categoria_codigo } = req.body;
      
      await db.none(
        'UPDATE a_pagar SET valor = $1, data_vencimento = $2, status = $3, descricao = $4, categoria_codigo = $5 WHERE codigo = $6;'
        [valor, data_vencimento, status, descricao, categoria_codigo, id]
      );
      
      return res.status(200).send("Contas a pagar atualizado com sucesso!");
    } 
    catch (err) {
      return res.status(400).send({ error: 'Erro ao atualizar conta.', details: err.message });
    }
}

const deleteContasPagar = async (req, res) => {
  const {ids} = req.body;
  
      if (!ids || ids.length === 0) {
          return res.status(400).json({ message: 'Nenhum ID de conta foi fornecido para exclusão.' });
      }
      const idInt = ids.map(id => parseInt(id, 10));
  
    //converte o array para inteiro, para poder tirar do banco
      console.log("Array convertido para inteiros:", idInt);
  
      try {
          // Query SQL para deletar múltiplos registros usando ANY.
          // Ele deletará todas as linhas onde 'idc' for igual a qualquer valor no array $1.
          const queryText = 'DELETE FROM a_pagar WHERE codigo = ANY($1::int[])';
          
          const result = await db.query(queryText, [idInt]);
      
          // result.rowCount contém o número de linhas que foram deletadas
          res.status(200).json({ message: `${result.rowCount} conta(s) excluída(s) com sucesso.` });
          } 
          catch (error) {
              console.error('Erro ao excluir conta:', error);
              res.status(500).json({ message: 'Erro interno do servidor.' });
          }
}

module.exports = {
  getContasPagar,
  getContasPagarHoje,
  createContasPagar,
  updateContasPagar,
  deleteContasPagar
};
