const db = require('../config/db');

const getProcessos = async (req, res) => {
    try {
        const query_processos = 'SELECT cl.nome, cl.cpf_cnpj, p.descricao, p.comentarios, p.status, cp.nome FROM processos p JOIN clientes cl ON p.cliente_codigo = cl.codigo JOIN categorias_processo cp ON p.categoria_codigo = cp.codigo;';

        const { rows } = await db.query(query_processos);
        res.status(200).json(rows);
    } 
    catch (err) {
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

const createProcesso = async (req, res) => {
    const { descricao, comentarios, status, cliente_codigo, usuario_codigo, categoria_codigo, modelo_contrato_codigo } = req.body;

    try {
        const queryText = 'INSERT INTO processos (descricao, comentarios, status, cliente_codigo, usuario_codigo, categoria_codigo, modelo_contrato_codigo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;';
        const values = [descricao, comentarios, status, cliente_codigo, usuario_codigo, categoria_codigo, modelo_contrato_codigo];

        const { rows } = await db.query(queryText, values);

        res.status(201).json({ message: 'Processo cadastrado com sucesso!', processos: rows[0] });
    }
    catch (error) {
        console.error('Erro ao cadastrar processo:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

const updateProcesso = async (req, res) => {
    const { id } = req.params;
    
    const processoExiste = await db.oneOrNone("SELECT id FROM processos WHERE codigo = $1;", [id]);
    if (!processoExiste) {
        return res.status(404).send({ error: 'Processo não encontrado.' });
    }

    try {
        const { descricao, comentarios, status, cliente_codigo, usuario_codigo, categoria_codigo, modelo_contrato_codigo } = req.body;

        await db.none(
        'UPDATE processos SET descricao = $1, comentarios = $2, status = $3, cliente_codigo = $4, usuario_codigo = $5, categoria_codigo = $6, modelo_contrato_codigo = $7  WHERE codigo = $8;'
        [descricao, comentarios, status, cliente_codigo, usuario_codigo, categoria_codigo, modelo_contrato_codigo, id]
        );

        return res.status(200).send("Processo atualizado com sucesso!");
    } 
    catch (err) {
        return res.status(500).send({ error: 'Erro ao atualizar processo.', details: err.message });
    }
    
}

const deleteProcesso = async (req, res) => {
    const {ids} = req.body;

    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de processo foi fornecido para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));

    console.log("Array convertido para inteiros:", idInt);

    try {
        const queryText = 'DELETE FROM a_receber WHERE codigo = ANY($1::int[])';

        const result = await db.query(queryText, [idInt]);

        // result.rowCount contém o número de linhas que foram deletadas
        res.status(200).json({ message: `${result.rowCount} processo(s) excluído(s) com sucesso.` });
        } 
    catch (error) {
        console.error('Erro ao excluir processo:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

module.exports = {
    getProcessos,
    createProcesso,
    updateProcesso,
    deleteProcesso
}