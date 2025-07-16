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
        const query_creceber = `
            SELECT valor 
            FROM a_receber 
            WHERE data_vencimento = CURRENT_DATE;
        `;
        const { rows } = await db.query(query_creceber);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar contas a receber do dia:', error);
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
        const processoResult = await client.query('SELECT cliente_codigo FROM processos WHERE codigo = $1', [processo_codigo]);
        if (processoResult.rows.length === 0) {
            throw new Error('Processo não encontrado.');
        }
        const cliente_codigo = processoResult.rows[0].cliente_codigo;

        const parcelas = [];
        const valorParcela = parseFloat(valor_total) / parseInt(numero_parcelas, 10);
        const dataInicial = new Date(data_primeiro_vencimento);

        let recorrencia = null;
        if (periodicidade === 'mensal') {
            recorrencia = 'M';
        } else if (periodicidade === 'unica') {
            recorrencia = 'U';
        }

        for (let i = 0; i < numero_parcelas; i++) {
            let dataVencimento = new Date(dataInicial);
            if (periodicidade === 'mensal') {
                dataVencimento.setMonth(dataVencimento.getMonth() + i);
            }
            parcelas.push({
                valor: valorParcela.toFixed(2),
                data_vencimento: dataVencimento.toISOString().split('T')[0],
                status: 'A',
                descricao: `${descricao_base} - Parcela ${i + 1}/${numero_parcelas}`,
                processo_codigo: parseInt(processo_codigo, 10),
                cliente_codigo: cliente_codigo,
                recorrencia: recorrencia
            });
        }
        
        await client.query('BEGIN');
        for (const parcela of parcelas) {
            const queryText = `
                INSERT INTO a_receber (valor, data_vencimento, status, descricao, processo_codigo, cliente_codigo, recorrencia)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `;
            const values = [parcela.valor, parcela.data_vencimento, parcela.status, parcela.descricao, parcela.processo_codigo, parcela.cliente_codigo, parcela.recorrencia];
            await client.query(queryText, values);
        }
        await client.query('COMMIT');
        res.status(201).json({ message: `${parcelas.length} parcela(s) lançada(s) com sucesso!` });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("--- ERRO DETALHADO AO LANÇAR PARCELAS ---");
        console.error("Mensagem:", error.message);
        console.error("Código do Erro PG:", error.code);
        console.error("Detalhe do Erro PG:", error.detail);
        console.error("---------------------------------------");
        res.status(500).json({ message: 'Erro interno ao salvar as parcelas.' });
    } finally {
        client.release();
    }
};

const relatorioContasAReceber = async (req, res) => {
    const { busca } = req.query;
    try {
        let query = `
            SELECT
                ar.codigo,
                c.nome AS cliente,
                p.descricao AS processo,
                ar.descricao,
                ar.data_vencimento,
                ar.valor
            FROM a_receber ar
            JOIN clientes c ON ar.cliente_codigo = c.codigo
            LEFT JOIN processos p ON ar.processo_codigo = p.codigo
            WHERE ar.status = 'A'
        `;
        const values = [];
        if (busca) {
            query += ` AND (c.nome ILIKE $1 OR p.descricao ILIKE $1 OR ar.descricao ILIKE $1)`;
            values.push(`%${busca}%`);
        }
        query += ' ORDER BY ar.data_vencimento;';
        
        const { rows } = await db.query(query, values);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro no relatório de contas a receber:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

/**
 * Gera dados para o relatório de Contas Recebidas (status 'R').
 */
const relatorioRecebimentos = async (req, res) => {
    const { busca } = req.query;
    try {
        let query = `
            SELECT
                ar.codigo,
                c.nome AS cliente,
                p.descricao AS processo,
                ar.descricao,
                ar.data_vencimento,
                ar.valor
            FROM a_receber ar
            JOIN clientes c ON ar.cliente_codigo = c.codigo
            LEFT JOIN processos p ON ar.processo_codigo = p.codigo
            WHERE ar.status = 'R'
        `;
        const values = [];
        if (busca) {
            query += ` AND (c.nome ILIKE $1 OR p.descricao ILIKE $1 OR ar.descricao ILIKE $1)`;
            values.push(`%${busca}%`);
        }
        query += ' ORDER BY ar.data_vencimento;';
        
        const { rows } = await db.query(query, values);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro no relatório de recebimentos:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
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


const deleteContasReceber =  async (req, res) => {
    const {ids} = req.body;
    
    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de conta foi fornecido para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));
    try {
                
        const queryText = `DELETE FROM a_receber WHERE codigo = ANY($1::int[]) AND status = 'A'`;
        
        const result = await db.query(queryText, [idInt]);

        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Contas recebidas não podem ser excluídas.' });
        }
        
        res.status(200).json({ message: `${result.rowCount} conta(s) excluída(s) com sucesso.` });
        } 
        catch (error) {
            console.error('Erro ao excluir conta:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }

};


module.exports = {
    getContasReceber,
    lancarParcelas,
    updateStatusContasReceber,
    getContasReceberHoje,
    deleteContasReceber,
    relatorioContasAReceber,
    relatorioRecebimentos
};
