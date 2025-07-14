const db = require('../config/db');

const getProcessos = async (req, res) => {
    try {
        const query_processos = `
            SELECT 
                p.codigo, p.descricao, p.status,
                cl.nome AS cliente_nome,
                cp.nome AS categoria_nome,
                (SELECT COUNT(*) FROM a_receber ar WHERE ar.processo_codigo = p.codigo) AS contas_lancadas_count
            FROM processos p
            JOIN clientes cl ON p.cliente_codigo = cl.codigo
            JOIN categorias_processo cp ON p.categoria_codigo = cp.codigo
            ORDER BY p.codigo ASC;
        `;
        const { rows } = await db.query(query_processos);
        res.status(200).json(rows);
    } 
    catch (err) {
        console.error("Erro ao buscar processos:", err);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const createProcesso = async (req, res) => {
    const { 
        descricao, comentarios, cliente_codigo, 
        usuario_codigo, categoria_codigo, modelo_contrato_codigo
    } = req.body;

    const clienteId = parseInt(cliente_codigo, 10);
    const usuarioId = parseInt(usuario_codigo, 10);
    const categoriaId = parseInt(categoria_codigo, 10);
    const modeloId = parseInt(modelo_contrato_codigo, 10);

    if (isNaN(clienteId) || isNaN(usuarioId) || isNaN(categoriaId) || isNaN(modeloId)) {
        return res.status(400).json({ message: 'Cliente, advogado, categoria e modelo de contrato são obrigatórios.' });
    }

    try {
        const queryText = `
            INSERT INTO processos 
                (descricao, comentarios, status, cliente_codigo, usuario_codigo, categoria_codigo, modelo_contrato_codigo) 
            VALUES ($1, $2, 'A', $3, $4, $5, $6) RETURNING *;`;
        
        const values = [descricao || null, comentarios || null, clienteId, usuarioId, categoriaId, modeloId];
        const { rows } = await db.query(queryText, values);
        res.status(201).json({ message: 'Processo criado com sucesso!', processo: rows[0] });
    } catch (error) {
        console.error('Erro ao inserir processo:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const getProcessoParaLancamento = async (req, res) => {
    const { id } = req.params;
    try {
        const queryText = `
            SELECT 
                p.codigo, 
                p.descricao,
                cl.nome AS cliente_nome 
            FROM processos p
            JOIN clientes cl ON p.cliente_codigo = cl.codigo
            WHERE p.codigo = $1;
        `;
        const { rows } = await db.query(queryText, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Processo não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Erro ao buscar dados do processo para lançamento:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};


const updateProcesso = async (req, res) => {
    const { id } = req.params;
    const { descricao, comentarios, status, cliente_codigo, usuario_codigo, categoria_codigo, modelo_contrato_codigo } = req.body;

    try {
        const queryText = `
            UPDATE processos SET 
                descricao = $1, comentarios = $2, status = $3, cliente_codigo = $4, 
                usuario_codigo = $5, categoria_codigo = $6, modelo_contrato_codigo = $7 
            WHERE codigo = $8 RETURNING *;`;
        
        const values = [descricao, comentarios, status, cliente_codigo, usuario_codigo, categoria_codigo, modelo_contrato_codigo, id];
        const { rowCount } = await db.query(queryText, values);

        if (rowCount === 0) {
            return res.status(404).send({ error: 'Processo não encontrado.' });
        }
        return res.status(200).send("Processo atualizado com sucesso!");
    } 
    catch (err) {
        console.error('Erro ao atualizar processo:', err);
        return res.status(500).send({ error: 'Erro ao atualizar processo.', details: err.message });
    }
};

const deleteProcesso = async (req, res) => {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de processo foi fornecido para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));

    try {
        
        const queryText = 'DELETE FROM processos WHERE codigo = ANY($1::int[])';
        const result = await db.query(queryText, [idInt]);
        res.status(200).json({ message: `${result.rowCount} processo(s) excluído(s) com sucesso.` });
    } 
    catch (error) {
        console.error('Erro ao excluir processo:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
const gerarContratoTexto = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                p.descricao AS descricao_processo,
                cl.nome AS nome_cliente,
                cl.cpf_cnpj,
                cp.nome AS categoria_nome,
                mc.implementacao_modelo,
                (SELECT SUM(ar.valor) FROM a_receber ar WHERE ar.processo_codigo = p.codigo) AS valor_total
            FROM processos p
            JOIN clientes cl ON cl.codigo = p.cliente_codigo
            JOIN categorias_processo cp ON cp.codigo = p.categoria_codigo
            JOIN modelos_contratos mc ON mc.codigo = p.modelo_contrato_codigo
            WHERE p.codigo = $1;
        `;

        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Dados do processo não encontrados.' });
        }

        const dados = rows[0];
 
        let contratoFinal = dados.implementacao_modelo;

        if (!contratoFinal) {
            return res.status(400).json({ message: 'Este processo não tem um modelo de contrato válido associado.' });
        }

        const valorFormatado = dados.valor_total
            ? Number(dados.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : 'R$ 0,00';

        const variaveis = {
            '{{nome_cliente}}': dados.nome_cliente,
            '{{cpf}}': dados.cpf_cnpj,
            '{{descricao_processo}}': dados.descricao_processo,
            '{{valor}}': valorFormatado,
            '{{categoria}}': dados.categoria_nome
        };


        for (const [variavel, valor] of Object.entries(variaveis)) {
            // Usamos uma RegExp global para substituir todas as ocorrências
            contratoFinal = contratoFinal.replace(new RegExp(variavel, 'g'), valor || '');
        }

        res.status(200).json({ contrato: contratoFinal });

    } catch (err) {
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
   // relatorioProcessos,
    getProcessoParaLancamento 
};

