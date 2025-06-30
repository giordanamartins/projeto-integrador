const db = require('../config/db');

const getClientes = async (req, res) => {
  try {
    const query_clientes = 'SELECT * FROM clientes ORDER BY idc ASC';
    const { rows } = await db.query(query_clientes);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Erro ao buscar clientes no banco de dados:', error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const  createClientes = async (req, res) => {
  const { nome, email, cpf, telefone } = req.body;

  //exemplo de validacao
  if (!nome) {
        return res.status(400).json({ message: 'O campo nome é obrigatório.' });
  }

  try {
        const queryText = 'INSERT INTO clientes (nome, email, cpf, telefone) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [nome, email, cpf, telefone];
        
    
        const { rows } = await db.query(queryText, values);
        
      
        res.status(201).json({ message: 'Cliente criado com sucesso!', cliente: rows[0] });

    } catch (error) {
        console.error('Erro ao inserir cliente:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  
}

const deleteClientes = async (req, res) => {
  const {ids} = req.body;


  if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de cliente foi fornecido para exclusão.' });
    }
  const idInt = ids.map(id => parseInt(id, 10));


  //converte o array para inteiro, para poder tirar do banco
   console.log("Array convertido para inteiros:", idInt);

  try {
    // Query SQL para deletar múltiplos registros usando ANY.
    // Ele deletará todas as linhas onde 'idc' for igual a qualquer valor no array $1.
    const queryText = 'DELETE FROM clientes WHERE idc = ANY($1::int[])';
    
    const result = await db.query(queryText, [idInt]);

    // result.rowCount contém o número de linhas que foram deletadas
    res.status(200).json({ message: `${result.rowCount} cliente(s) excluído(s) com sucesso.` });
  } catch (error) {

      if (error.code === '23503') {
          return res.status(409).json({ 
              message: 'Não é possível excluir: um ou mais clientes selecionados possuem contas a receber atreladas.' 
          });
      }
      console.error('Erro ao excluir clientes:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};


module.exports = {
  getClientes,
  createClientes,
  deleteClientes
};