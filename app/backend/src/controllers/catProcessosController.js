const db = require('../config/db');

const getCatProcesso = async (req, res) => {
    const { busca } = req.query;
    try {
        let queryText = 'SELECT * FROM categorias_processo';
        const values = [];

        if (busca) {
            queryText += ' WHERE nome ILIKE $1 OR descricao ILIKE $1';
            values.push(`%${busca}%`);
        }
        
        queryText += ' ORDER BY nome ASC;';

        const { rows } = await db.query(queryText, values);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Erro ao buscar categorias de processo:', error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const getCatProcessoById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query('SELECT * FROM categorias_processo WHERE codigo = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Categoria de processo não encontrada.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar categoria de processo por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const createCatProcesso = async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ message: 'Os campos "nome" e "descrição" são obrigatórios.' });
    }

    try {
        const queryText = 'INSERT INTO categorias_processo (nome, descricao) VALUES ($1, $2) RETURNING *';
        const { rows } = await db.query(queryText, [nome, descricao]);
        res.status(201).json({ message: 'Categoria de processo criada com sucesso!', categoria: rows[0] });
    } catch (error) {
        console.error('Erro ao inserir categoria de processo:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const updateCatProcesso = async (req, res) => {
    const { id } = req.params;
    // CORREÇÃO: Pegando nome e descricao do req.body de uma só vez
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ message: 'Os campos "nome" e "descrição" são obrigatórios.' });
    }

    try {
        const queryText = 'UPDATE categorias_processo SET nome = $1, descricao = $2 WHERE codigo = $3 RETURNING *';
        const { rows, rowCount } = await db.query(queryText, [nome, descricao, id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Categoria não encontrada para atualização.' });
        }
        
        res.status(200).json({ message: 'Categoria atualizada com sucesso!', categoria: rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar categoria de processo:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const deleteCatProcesso = async (req, res) => {
    // ... seu código de delete ...
};

const cloneCatProcesso = async (req, res) => {
    // ... seu código de clone ...
};

// CORREÇÃO: Exportando a função getCatProcessoById que estava faltando
module.exports = {
    getCatProcesso,
    getCatProcessoById,
    createCatProcesso,
    updateCatProcesso,
    deleteCatProcesso,
    cloneCatProcesso
};
