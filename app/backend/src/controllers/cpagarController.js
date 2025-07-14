const db = require('../config/db');

const getContasPagar = async (req, res) => {
    try {
        const query_cpagar = `SELECT 
                cp.codigo, cp.valor, cp.data_vencimento, cp.status, 
                cp.descricao, 
                cd.descricao AS categoria_descricao 
            FROM a_pagar cp 
            JOIN categorias_despesa cd ON cp.categoria_codigo = cd.codigo 
            ORDER BY cp.data_vencimento ASC;`;
        const { rows } = await db.query(query_cpagar);
        res.status(200).json(rows);

    } 
    catch (error) {
        console.error('Erro ao buscar contas a pagar no banco de dados:', error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const getContasPagarHoje = async (req, res) => {
    try{
        const query_cpagar = 'SELECT cp.valor, cp.data_vencimento, cp.status, cp.descricao, cd.descricao FROM a_pagar cp JOIN categorias_despesa cd on cp.categoria_codigo = cd.codigo WHERE data_vencimento = CURRENT_DATE ORDER BY cp.data_vencimento ASC;';
        const { rows } = await db.query(query_cpagar);
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Erro ao buscar contas a pagar do dia:', error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const createContasPagar = async (req, res) => {
    const { valor, data_vencimento, descricao, categoria_codigo } = req.body;

    if (!valor || !data_vencimento || !categoria_codigo) {
            return res.status(400).json({ message: 'Valor, Data de Vencimento e Categoria são obrigatórios.' });
        }

    try{
        const queryText = 'INSERT INTO a_pagar (valor, data_vencimento, status, descricao, categoria_codigo) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
        const values = [valor, data_vencimento, 'A', descricao, categoria_codigo];

        const { rows } = await db.query(queryText, values);

        res.status(201).json({ message: 'Contas a pagar criado com sucesso!', cliente: rows[0] });
    }
    catch(error){
        console.error('Erro ao inserir contas a pagar:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

const updateContasPagar = async (req, res) => {
    const { id } = req.params;

    const { valor, data_vencimento, status, descricao, categoria_codigo } = req.body;

    if (!valor || !data_vencimento || !categoria_codigo || !status) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios para atualização.' });
    }

    try {
        const queryText = `
            UPDATE a_pagar SET 
                valor = $1, data_vencimento = $2, status = $3, descricao = $4, categoria_codigo = $5 
            WHERE codigo = $6 RETURNING *;`;
        const values = [valor, data_vencimento, status, descricao || null, categoria_codigo, id];
        const { rows, rowCount } = await db.query(queryText, values);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Conta não encontrada para atualização.' });
        }
        
        res.status(200).json({ message: 'Conta a pagar atualizada com sucesso!', conta: rows[0] });
    } 
    catch (error) { 
        return res.status(500).json({ error: 'Erro ao atualizar conta.', details: error.message });
    }
};

const deleteContasPagar = async (req, res) => {
    const {ids} = req.body;
    
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: 'Nenhum ID de conta foi fornecido para exclusão.' });
        }
        const idInt = ids.map(id => parseInt(id, 10));
    
        
    
        try {
            
            const queryText = `DELETE FROM a_pagar WHERE codigo = ANY($1::int[]) AND status = 'A'`;
            
            const result = await db.query(queryText, [idInt]);

            if (result.rowCount === 0) {
                return res.status(400).json({ message: 'Contas pagas não podem ser excluídas.' });
            }
            
            res.status(200).json({ message: `${result.rowCount} conta(s) excluída(s) com sucesso.` });
            } 
            catch (error) {
                console.error('Erro ao excluir conta:', error);
                res.status(500).json({ message: 'Erro interno do servidor.' });
            }
};

const updateStatus = async (req, res) => {
    const { ids, status } = req.body;

    
    if (!ids || ids.length === 0 || !status) {
        return res.status(400).json({ message: 'IDs e um novo status são obrigatórios.' });
    }
    if (!['A', 'B'].includes(status)) {
        return res.status(400).json({ message: 'Status inválido. Use "A" para Em Aberto ou "B" para Pago.' });
    }

    try {
        const idsComoInteiros = ids.map(id => parseInt(id, 10));
        
        const queryText = 'UPDATE a_pagar SET status = $1 WHERE codigo = ANY($2::int[])';
        const result = await db.query(queryText, [status, idsComoInteiros]);

        res.status(200).json({ message: `${result.rowCount} conta(s) atualizada(s) com sucesso.` });

    } catch (error) {
        console.error('Erro ao atualizar status das contas:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const relatorioContasAPagar = async (req, res) => {
    try {
        const query = `SELECT a.codigo, a.descricao, a.data_vencimento, cd.descricao AS categoria_descricao, a.valor 
               FROM a_pagar a 
               JOIN categorias_despesa cd ON a.categoria_codigo = cd.codigo 
               WHERE a.status = 'A' 
               ORDER BY a.data_vencimento;`;
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } 
    catch (error) {
        console.error('Erro no relatório de contas a pagar:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const relatorioPagamentos = async (req, res) => {
    try {
        const query = "SELECT a.codigo, a.descricao, a.data_vencimento, cd.descricao, a.valor FROM a_pagar a JOIN categorias_despesa cd ON a.categoria_codigo = cd.codigo WHERE a.status = 'A' ORDER BY a.data_vencimento;";
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } 
    catch (error) {
        console.error('Erro no relatório de pagamentos:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    getContasPagar,
    getContasPagarHoje,
    createContasPagar,
    updateContasPagar,
    deleteContasPagar,
    updateStatus,
    relatorioContasAPagar,
    relatorioPagamentos
};
