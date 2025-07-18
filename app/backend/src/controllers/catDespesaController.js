const db = require('../config/db');

const getCatDespesa = async (req, res) => {
    const { busca } = req.query;
    try {

        let query_CatDespesa = 'SELECT * FROM categorias_despesa';
        const values = [];

        if (busca) {

            query_CatDespesa += ' WHERE descricao ILIKE $1';
            values.push(`%${busca}%`);
        }
        
        query_CatDespesa += ' ORDER BY codigo ASC;';


        const { rows } = await db.query(query_CatDespesa, values);
        
        res.status(200).json(rows);

    } catch (error) {
        console.error('Erro ao buscar categorias no banco de dados:', error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const getCatById = async (req, res) => {
    const { id } = req.params;
    try {
        const queryText = 'SELECT * FROM categorias_despesa WHERE codigo = $1';
        const { rows } = await db.query(queryText, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar categoria por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const createCatDespesa = async (req, res) => {
    const { descricao } = req.body;

    if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
        return res.status(400).json({ message: 'Campo "descrição" é obrigatório.' });
    }

    try {
        const queryText = 'INSERT INTO categorias_despesa (descricao) VALUES ($1) RETURNING *';
        const { rows } = await db.query(queryText, [descricao]);
        res.status(201).json({ message: 'Categoria criada com sucesso!', categoria: rows[0] });
    } 
    catch (error) {
        console.error('Erro ao inserir categoria:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const updateCatDespesa = async (req, res) => {
    const { id } = req.params;
    const { descricao } = req.body;

    if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
        return res.status(400).json({ message: 'O campo "descricao" é obrigatório.' });
    }

    try {
        const queryText = 'UPDATE categorias_despesa SET descricao = $1 WHERE codigo = $2 RETURNING *;';
        const { rows, rowCount } = await db.query(queryText, [descricao, id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Categoria não encontrada para atualização.' });
        }
        
        res.status(200).json({ message: 'Categoria atualizada com sucesso!', categoria: rows[0] });
    } 
    catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const deleteCatDespesa = async (req, res) => {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de categoria foi fornecida para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));

    try {
        const queryText = 'DELETE FROM categorias_despesa WHERE codigo = ANY($1::int[])';
        const result = await db.query(queryText, [idInt]);
        res.status(200).json({ message: `${result.rowCount} categoria(s) excluída(s) com sucesso.` });
    } 
    catch (error) {
        console.error('Erro ao excluir categoria:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const cloneCatDespesa = async (req, res) => {
    const { id } = req.params;

    try {
        const originalResult = await db.query('SELECT * FROM categorias_despesa WHERE codigo = $1', [id]);
        
        if (originalResult.rows.length === 0) {
            return res.status(404).json({ message: 'Categoria original não encontrada.' });
        }
        
        const originalCategoria = originalResult.rows[0];
        const novaDescricao = `Cópia de ${originalCategoria.descricao}`;

        const queryText = 'INSERT INTO categorias_despesa (descricao) VALUES ($1) RETURNING *';
        const { rows } = await db.query(queryText, [novaDescricao]);
        
        res.status(201).json({ message: 'Categoria clonada com sucesso!', categoria: rows[0] });

    } catch (error) {
        console.error('Erro ao clonar categoria:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    getCatDespesa,
    getCatById,
    createCatDespesa,
    updateCatDespesa,
    deleteCatDespesa,
    cloneCatDespesa
};
