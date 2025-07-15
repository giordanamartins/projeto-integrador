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
        res.status(201).json({ message: 'Categoria criada com sucesso!', categoria: rows[0] });
    } 
    catch (error) { // CORREÇÃO: Usando a variável 'error' consistentemente
        console.error('Erro ao inserir categoria:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const updateCatProcesso = async (req, res) => {
    const { id } = req.params;

    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ message: 'Os campos "nome" e "descrição" são obrigatórios.' });
    }

    try {

        const queryText = 'UPDATE categorias_processo SET nome = $1, descricao = $2 WHERE codigo = $3 RETURNING *;';
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
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de categoria foi fornecido para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));

    try {
        const queryText = 'DELETE FROM categorias_processo WHERE codigo = ANY($1::int[])';
        const result = await db.query(queryText, [idInt]);
        res.status(200).json({ message: `${result.rowCount} categoria(s) de processo excluída(s) com sucesso.` });
    } catch (error) {

        if (error.code === '23503') {
            return res.status(409).json({ message: 'Não é possível excluir: Uma ou mais categorias estão em uso por processos existentes.' });
        }
        
        console.error('Erro ao excluir categoria de processo:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const cloneCatProc = async (req, res) => {
    const { id } = req.params;

    try {
        const originalResult = await db.query('SELECT * FROM categorias_processo WHERE codigo = $1', [id]);
        
        if (originalResult.rows.length === 0) {
            return res.status(404).json({ message: 'Categoria original não encontrada.' });
        }
        
        const originalCategoria = originalResult.rows[0];
        const novoNome = `Cópia de ${originalCategoria.nome}`;
        const novaDescricao = originalCategoria.descricao;


        const queryText = 'INSERT INTO categorias_processo (nome, descricao) VALUES ($1, $2) RETURNING *';
        const { rows } = await db.query(queryText, [novoNome, novaDescricao]);
        
        res.status(201).json({ message: 'Categoria clonada com sucesso!', categoria: rows[0] });

    } catch (error) {
        console.error('Erro ao clonar categoria:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    getCatProcesso,
    getCatProcessoById,
    createCatProcesso,
    updateCatProcesso,
    deleteCatProcesso,
    cloneCatProc // CORREÇÃO: Nome padronizado
};
