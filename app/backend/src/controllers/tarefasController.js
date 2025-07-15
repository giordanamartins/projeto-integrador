const db = require('../config/db');

const getTarefas = async (req, res) => {
    try {

        const query_tarefas = `
            SELECT 
                t.codigo, 
                u.nome as usuario_nome, 
                t.descricao, 
                t.data_hora 
            FROM tarefas t 
            JOIN usuarios u ON t.usuario_codigo = u.codigo 
            WHERE t.data_hora::date = CURRENT_DATE
            ORDER BY t.data_hora ASC;
        `;

        const { rows } = await db.query(query_tarefas);
        res.status(200).json(rows);
    } 
    catch (error) {

        console.error('ERRO DETALHADO AO BUSCAR TAREFAS:', error);
        res.status(500).json({ message: "Erro interno do servidor. Verifique o terminal do backend." });
    }
};
/**
 * Busca uma única tarefa pelo seu ID.
 */
const getTarefaById = async (req, res) => {
    const { id } = req.params;
    try {
        const queryText = 'SELECT * FROM tarefas WHERE codigo = $1';
        const { rows } = await db.query(queryText, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar tarefa por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

/**
 * Cria uma nova tarefa.
 */
const createTarefa = async (req, res) => {
    const { descricao, data_hora } = req.body;
    const usuario_codigo = req.user.codigo;

    if (!data_hora) {
        return res.status(400).json({ message: 'Data/Hora é obrigatório.' });
    }

    try {
        const queryText = 'INSERT INTO tarefas (descricao, data_hora, usuario_codigo) VALUES ($1, $2, $3) RETURNING *;';
        const values = [descricao || null, data_hora, usuario_codigo];
        const { rows } = await db.query(queryText, values);
        res.status(201).json({ message: 'Tarefa cadastrada com sucesso!', tarefa: rows[0] });
    } 
    catch (error) {
        console.error('Erro ao cadastrar tarefa:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

/**
 * Atualiza uma tarefa existente.
 */
const updateTarefa = async (req, res) => {
    const { id } = req.params;
    const { descricao, data_hora } = req.body; // O usuário da tarefa não pode ser alterado

    if (!data_hora) {
        return res.status(400).json({ message: 'Data/Hora é obrigatório.' });
    }

    try {
        const queryText = 'UPDATE tarefas SET descricao = $1, data_hora = $2 WHERE codigo = $3 RETURNING *;';
        const values = [descricao || null, data_hora, id];
        const { rowCount } = await db.query(queryText, values);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada para atualização.' });
        }
        res.status(200).json({ message: 'Tarefa atualizada com sucesso!' });
    } 
    catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

/**
 * Deleta uma ou mais tarefas.
 */
const deleteTarefa = async (req, res) => {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de tarefa foi fornecido para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));
    
    try {
        const queryText = 'DELETE FROM tarefas WHERE codigo = ANY($1::int[])';
        const result = await db.query(queryText, [idInt]);
        res.status(200).json({ message: `${result.rowCount} tarefa(s) excluída(s) com sucesso.` });
    } 
    catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    getTarefas,
    getTarefaById,
    createTarefa,
    updateTarefa,
    deleteTarefa
};