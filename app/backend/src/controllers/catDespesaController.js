const db = require('../config/db');

const getCatDespesa = async (req, res) => {
    try {
        const query_CatDespesa = 'SELECT * FROM categorias_despesa ORDER BY idc ASC';
        const { rows } = await db.query(query_CatDespesa);
        res.status(200).json(rows);
    } 
    catch (err) {
    console.error('Erro ao buscar categorias no banco de dados:', error);
    res.status(500).json({ message: "Erro interno do servidor." });
    }
}

const createCatDespesa = async (req, res) => {
    const { descricao } = req.body;

    if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
        return res.status(400).json({ message: 'Campo "descrição" é obrigatório.' });
    }

    try {
        const queryText = 'INSERT INTO categorias_despesa (descricao) VALUES ($1) RETURNING *';
        const values = [descricao];
    
        const { rows } = await db.query(queryText, values);
        
        res.status(201).json({ message: 'Categoria criada com sucesso!', categoria: rows[0] });
    } 
    catch (err) {
        console.error('Erro ao inserir categoria:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

const updateCatDespesa = async (req, res) => {
    const {id} = req.params;

    const catExiste = await db.oneOrNone("SELECT id FROM categorias_despesa WHERE id = $1", [id]);
    if (!catExiste) {
    return res.status(404).send({ error: 'Categoria não encontrada.' });
    }

    try {
        const { descricao } = req.body;

        if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
            return res.status(400).json({ message: 'Campo "descricao" é obrigatório.' });
        }

        await db.none(
            'UPDATE categorias_despesa SET descricao = $1 WHERE codigo = $2;'
            [descricao, id]
        );

        return res.status(200).send("Categoria atualizada com sucesso!");
        
    } 
    catch (err) {
        return res.status(400).send({ error: 'Erro ao atualizar categoria.', details: err.message });
    }

}

const deleteCatDespesa = async (req, res) => {
    const {ids} = req.body;

    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de categoria foi fornecida para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));

  //converte o array para inteiro, para poder tirar do banco
    console.log("Array convertido para inteiros:", idInt);

    try {
        // Query SQL para deletar múltiplos registros usando ANY.
        // Ele deletará todas as linhas onde 'idc' for igual a qualquer valor no array $1.
        const queryText = 'DELETE FROM categorias_despesa WHERE codigo = ANY($1::int[])';
        
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
    getCatDespesa,
    createCatDespesa,
    updateCatDespesa,
    deleteCatDespesa
};