const db = require('../config/db');

const getCatProcesso = async (req, res) => {
    try {
        const query_CatProcesso = 'SELECT * FROM categorias_processo ORDER BY idc ASC';
        const { rows } = await db.query(query_CatProcesso);
        res.status(200).json(rows);
    } 
    catch (err) {
    console.error('Erro ao buscar categorias no banco de dados:', error);
    res.status(500).json({ message: "Erro interno do servidor." });
    }
}

const createCatProcesso = async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ message: 'Campo "nome" é obrigatório.' });
    }

    if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
        return res.status(400).json({ message: 'Campo "descrição" é obrigatório.' });
    }

    try {
        const queryText = 'INSERT INTO categorias_processo (nome, descricao) VALUES ($1, $2) RETURNING *';
        const values = [nome, descricao];
    
        const { rows } = await db.query(queryText, values);
        
        res.status(201).json({ message: 'Categoria criada com sucesso!', categoria: rows[0] });
    } 
    catch (err) {
        console.error('Erro ao inserir categoria:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

const updateCatProcesso = async (req, res) => {
    const {id} = req.params;

    const catExiste = await db.oneOrNone("SELECT id FROM categorias_processo WHERE id = $1", [id]);
    if (!catExiste) {
    return res.status(404).send({ error: 'Categoria não encontrada.' });
    }

    try {
        const { nome, descricao } = req.body;
        
        if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ message: 'Campo "nome" é obrigatório.' });
        }

        if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
            return res.status(400).json({ message: 'Campo "descrição" é obrigatório.' });
        }

        await db.none(
            'UPDATE categorias_processo SET nome = $1, descricao = $2 WHERE codigo = $3;'
            [nome, descricao, id]
        );

        return res.status(200).send("Categoria atualizada com sucesso!");
        
    } 
    catch (err) {
        return res.status(400).send({ error: 'Erro ao atualizar categoria.', details: err.message });
    }

}

const deleteCatProcesso = async (req, res) => {
    const {ids} = req.body;

    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de categoria foi fornecido para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));

  //converte o array para inteiro, para poder tirar do banco
    console.log("Array convertido para inteiros:", idInt);

    try {
        // Query SQL para deletar múltiplos registros usando ANY.
        // Ele deletará todas as linhas onde 'idc' for igual a qualquer valor no array $1.
        const queryText = 'DELETE FROM categorias_processo WHERE codigo = ANY($1::int[])';
        
        const result = await db.query(queryText, [idInt]);
    
        // result.rowCount contém o número de linhas que foram deletadas
        res.status(200).json({ message: `${result.rowCount} categorias(s) excluída(s) com sucesso.` });
        } 
        catch (error) {
            console.error('Erro ao excluir categoria:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
}

module.exports = {
    getCatProcesso,
    createCatProcesso,
    updateCatProcesso,
    deleteCatProcesso
};