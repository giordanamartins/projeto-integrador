const db = require('../config/db');

const getTarefas = async (req, res) => {
    try {
        const query_tarefas = 'SELECT u.nome, t.descricao, t.data_hora FROM tarefas t JOIN usuarios u ON t.usuario_codigo = u.codigo ORDER BY t.data_hora ASC;';

        const { rows } = await db.query(query_tarefas);
        res.status(200).json(rows);
    } 
    catch (error) {
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

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

        res.status(201).json({ message: 'Tarefa cadastrada com sucesso!', tarefas: rows[0] });
    } 
    catch (error) {
        console.error('Erro ao cadastrar tarefa:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

const updateTarefa = async (req, res) => {
    const { id } = req.params;
    
    const tarefaExiste = await db.oneOrNone("SELECT id FROM tarefas WHERE codigo = $1;", [id]);
    if (!tarefaExiste) {
        return res.status(404).send({ error: 'Tarefa não encontrada.' });
    }
    
    try {
        const { descricao, data_hora, usuario_codigo } = req.body;

        await db.none(
        'UPDATE tarefas SET descricao = $1, data_hora = $2, usuario_codigo = $3 WHERE codigo = $4;'
        [descricao, data_hora, usuario_codigo, id]
        );

        return res.status(200).send("Tarefa atualizada com sucesso!");
    } 
    catch (err) {
        return res.status(500).send({ error: 'Erro ao atualizar tarefa.', details: err.message });
    }
}

const deleteTarefa = async (req, res) => {
    const {ids} = req.body;
    
    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de tarefa foi fornecido para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));
    
    console.log("Array convertido para inteiros:", idInt);
    
    try {
        const queryText = 'DELETE FROM tarefas WHERE codigo = ANY($1::int[])';

        const result = await db.query(queryText, [idInt]);
    
        // result.rowCount contém o número de linhas que foram deletadas
        res.status(200).json({ message: `${result.rowCount} tarefa(s) excluída(s) com sucesso.` });
        } 
    catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

module.exports = {
    getTarefas,
    createTarefa,
    updateTarefa,
    deleteTarefa
}