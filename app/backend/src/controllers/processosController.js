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

const gerarContratoTexto = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
        SELECT 
            p.descricao,
            p.status,
            cl.nome,
            cl.cpf_cnpj,
            cp.nome AS categoria,
            mc.implementacao_modelo,
            (
                SELECT SUM(ar.valor)
                FROM a_receber ar
                WHERE ar.processo_codigo = p.codigo
            ) AS valor
            FROM processos p
            JOIN clientes cl ON cl.codigo = p.cliente_codigo
            JOIN categorias_processo cp ON cp.codigo = p.categoria_codigo
            JOIN modelos_contratos mc ON mc.codigo = p.modelo_contrato_codigo
            WHERE p.codigo = $1;
        `;

        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
        return res.status(404).json({ message: 'Processo não encontrado.' });
        }

        const dados = rows[0];
        let contrato = dados.modelo;

        const valorFormatado = dados.valor_total
        ? `R$ ${Number(dados.valor_total).toFixed(2).replace('.', ',')}`
        : 'R$ 0,00';

        const variaveis = {
            '{{nome_cliente}}': dados.nome,
            '{{cpf}}': dados.cpf_cnpj,
            '{{descricao}}': dados.descricao,
            '{{valor}}': valorFormatado,
            '{{categoria}}': dados.categoria
        };

        for (const [variavel, valor] of Object.entries(variaveis)) {
        contrato = contrato.replaceAll(variavel, valor || '');
        }

        res.status(200).json({ contrato });

    } 
    catch (err) {
        console.error('Erro ao gerar contrato preenchido:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const relatorioProcessos = async (req, res) => {
    try {
        const query = `
        SELECT
            p.codigo,
            p.descricao,
            p.comentarios,
            p.status,
            c.nome AS cliente,
            u.nome AS usuario,
            cp.nome AS categoria,
            p.modelo_contrato_codigo
        FROM processos p
        JOIN clientes c ON p.cliente_codigo = c.codigo
        JOIN usuarios u ON p.usuario_codigo = u.codigo
        JOIN categorias_processo cp ON p.categoria_codigo = cp.codigo
        WHERE status = 'A'
        ORDER BY p.codigo;
        `;
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro no relatório de processos:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    getProcessos,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    gerarContratoTexto,
    relatorioProcessos
}
