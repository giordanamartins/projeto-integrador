const db = require('../config/db');


const getContasReceber = async (req, res) => {
    const { busca } = req.query;
    try {
        let queryText = `
            SELECT 
                ar.codigo, ar.descricao, ar.data_vencimento, ar.valor, ar.status,
                cl.nome AS cliente_nome,
                p.codigo AS processo_codigo
            FROM a_receber ar
            JOIN clientes cl ON ar.cliente_codigo = cl.codigo
            LEFT JOIN processos p ON ar.processo_codigo = p.codigo
        `;
        const values = [];

        if (busca) {
            queryText += ' WHERE cl.nome ILIKE $1 OR ar.descricao ILIKE $1';
            values.push(`%${busca}%`);
        }
        
        queryText += ' ORDER BY ar.data_vencimento ASC;';

        const { rows } = await db.query(queryText, values);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Erro ao buscar contas a receber:', error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const getContasReceberHoje = async (req, res) => {
    try {
          let queryText = `
              SELECT 
                  ar.codigo, ar.descricao, ar.data_vencimento, ar.valor, ar.status,
                  cl.nome AS cliente_nome,
                  p.codigo AS processo_codigo
              FROM a_receber ar
              JOIN clientes cl ON ar.cliente_codigo = cl.codigo
              LEFT JOIN processos p ON ar.processo_codigo = p.codigo
              WHERE data_vencimento = CURRENT_DATE
          `;
          const { rows } = await db.query(queryText);
          res.status(200).json(rows);
        }
    catch (error) {
        console.error('Erro ao buscar contas a pagar do dia:', error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const lancarParcelas = async (req, res) => {
    const {
        processo_codigo, valor_total, data_primeiro_vencimento,
        periodicidade, numero_parcelas, descricao_base
    } = req.body;

    if (!processo_codigo || !valor_total || !data_primeiro_vencimento || !periodicidade || !numero_parcelas) {
        return res.status(400).json({ message: 'Todos os campos para cálculo de parcelas são obrigatórios.' });
    }

    const client = await db.connect();
    try {
          const processoQuery = `
          SELECT 
              p.cliente_codigo, 
              cp.nome AS categoria_nome 
          FROM processos p
          JOIN categorias_processo cp ON p.categoria_codigo = cp.codigo
          WHERE p.codigo = $1
      `;
      const processoResult = await client.query(processoQuery, [processo_codigo]);

      if (processoResult.rows.length === 0) {
          throw new Error('Processo não encontrado.');
      }
      
      const { cliente_codigo, categoria_nome } = processoResult.rows[0];

      const parcelas = [];
      const valorParcela = parseFloat(valor_total) / parseInt(numero_parcelas, 10);
      const dataInicial = new Date(data_primeiro_vencimento);

      for (let i = 0; i < numero_parcelas; i++) {
          let dataVencimento = new Date(dataInicial);
          if (periodicidade === 'mensal') {
              dataVencimento.setMonth(dataVencimento.getMonth() + i);
          }
          parcelas.push({
              valor: valorParcela.toFixed(2),
              data_vencimento: dataVencimento.toISOString().split('T')[0],
              status: 'A',
              descricao: `Ref ao processo judicial ${categoria_nome} - Parcela ${i + 1}/${numero_parcelas}`,
              processo_codigo: parseInt(processo_codigo, 10),
              cliente_codigo: cliente_codigo
          });
      }
      
      await client.query('BEGIN');
      for (const parcela of parcelas) {
          const queryText = `
              INSERT INTO a_receber (valor, data_vencimento, status, descricao, processo_codigo, cliente_codigo)
              VALUES ($1, $2, $3, $4, $5, $6);
          `;
          const values = [parcela.valor, parcela.data_vencimento, parcela.status, parcela.descricao, parcela.processo_codigo, parcela.cliente_codigo];
          await client.query(queryText, values);
      }
      await client.query('COMMIT');
      res.status(201).json({ message: `${parcelas.length} parcela(s) lançada(s) com sucesso!` });
  } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao lançar parcelas:', error);
      res.status(500).json({ message: 'Erro interno ao salvar as parcelas.' });
  } finally {
      client.release();
  }
};


const updateStatusContasReceber = async (req, res) => {
    const { ids, status } = req.body;

    if (!ids || ids.length === 0 || !status || !['A', 'R', 'X'].includes(status)) {
        return res.status(400).json({ message: 'IDs e um status válido ("A", "R" ou "X") são obrigatórios.' });
    }

    try {
        const idsComoInteiros = ids.map(id => parseInt(id, 10));
        const queryText = 'UPDATE a_receber SET status = $1 WHERE codigo = ANY($2::int[])';
        const result = await db.query(queryText, [status, idsComoInteiros]);
        res.status(200).json({ message: `${result.rowCount} conta(s) atualizada(s) com sucesso.` });
    } catch (error) {
        console.error('Erro ao atualizar status das contas:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};



module.exports = {
    getContasReceber,
    lancarParcelas,
    updateStatusContasReceber,
    getContasReceberHoje
};
