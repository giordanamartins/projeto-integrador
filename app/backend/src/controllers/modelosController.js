const db = require('../config/db');

const getModelosContratos = async (req, res) => {
    try {
        const query = 'SELECT * FROM modelos_contratos ORDER BY codigo ASC;';
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } 
    catch (error) {
        console.error('Erro ao buscar modelos de contrato:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const createModeloContrato = async (req, res) => {
    const { implementacao_modelo } = req.body;

    if (!implementacao_modelo || typeof implementacao_modelo !== 'string' || !implementacao_modelo.trim()) {
        return res.status(400).json({ error: 'O campo "implementacao_modelo" é obrigatório.' });
    }

    try {
        const query = 'INSERT INTO modelos_contratos (implementacao_modelo) VALUES ($1) RETURNING *;';
        const values = [implementacao_modelo.trim()];
        const { rows } = await db.query(query, values);

        res.status(201).json({ message: 'Modelo de contrato criado com sucesso!', modelo: rows[0] });
    } catch (error) {
        console.error('Erro ao criar modelo de contrato:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const updateModeloContrato = async (req, res) => {
    const { id } = req.params;
    const { implementacao_modelo } = req.body;

    if (!implementacao_modelo || typeof implementacao_modelo !== 'string' || !implementacao_modelo.trim()) {
        return res.status(400).json({ error: 'O campo texto do modelo é obrigatório.' });
    }

    try {
        const modeloExiste = await db.oneOrNone('SELECT codigo FROM modelos_contratos WHERE codigo = $1;', [id]);
        if (!modeloExiste) {
        return res.status(404).json({ error: 'Modelo de contrato não encontrado.' });
        }

        await db.query(
        'UPDATE modelos_contratos SET implementacao_modelo = $1 WHERE codigo = $2;',
        [implementacao_modelo.trim(), id]
        );

        res.status(200).json({ message: 'Modelo de contrato atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar modelo de contrato:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const deleteModelosContratos = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID fornecido para exclusão.' });
    }

    const idInt = ids.map(id => parseInt(id, 10));
    console.log("Array convertido para inteiros:", idInt);

    try {
        const query = 'DELETE FROM modelos_contratos WHERE codigo = ANY($1::int[])';
        const result = await db.query(query, [idInt]);

        res.status(200).json({ message: `${result.rowCount} modelo(s) excluído(s) com sucesso.` });
    } 
    catch (error) {
        console.error('Erro ao excluir modelo(s) de contrato:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    getModelosContratos,
    createModeloContrato,
    updateModeloContrato,
    deleteModelosContratos
};
