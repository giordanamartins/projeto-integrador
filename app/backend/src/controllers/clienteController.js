const db = require('../config/db');
const validator = require('validator');

const getClientes = async (req, res) => {
    const {busca} = req.query;
    try {
        let query_clientes = 'SELECT * FROM clientes';
        const values = [];
        if (busca) {
            query_clientes += ' WHERE nome ILIKE $1 OR email ILIKE $1 OR cpf_cnpj ILIKE $1';
            values.push(`%${busca}%`);
        }
        query_clientes += ' ORDER BY codigo ASC;';
        const { rows } = await db.query(query_clientes, values);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const queryText = 'SELECT * FROM clientes WHERE codigo = $1';
        const { rows } = await db.query(queryText, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

function validarDadosCliente(dados) {
    const { nome, cpf_cnpj, email, data_nascimento, tipo_pessoa, telefone1 } = dados;
    const camposObrigatorios = ['nome', 'cpf_cnpj', 'email', 'data_nascimento', 'tipo_pessoa', 'telefone1'];
    for (const campo of camposObrigatorios) {
        if (!dados[campo]) {
            return { ok: false, error: `Campo obrigatório "${campo}" não preenchido.` };
        }
    }
    if (!validator.isEmail(email)) {
        return { ok: false, error: 'E-mail inválido.' };
    }
    if (!['F', 'J'].includes(tipo_pessoa)) {
        return { ok: false, error: 'Tipo de pessoa deve ser "F" (física) ou "J" (jurídica).' };
    }
    if (isNaN(Date.parse(data_nascimento))) {
        return { ok: false, error: 'Data de nascimento inválida.' };
    }
    return { ok: true };
}

const createClientes = async (req, res) => {
    const dadosCliente = req.body;
    const resultadoValidacao = validarDadosCliente(dadosCliente);
    if (!resultadoValidacao.ok) {
        return res.status(400).send({ error: resultadoValidacao.error });
    }
    try {
        const queryText = 'INSERT INTO clientes (nome, cpf_cnpj, email, data_nascimento, comentario, tipo_pessoa, telefone1, telefone2, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_uf, endereco_cep) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *;';
        const values = [dadosCliente.nome, dadosCliente.cpf_cnpj, dadosCliente.email, dadosCliente.data_nascimento, dadosCliente.comentario || null, dadosCliente.tipo_pessoa, dadosCliente.telefone1, dadosCliente.telefone2 || null, dadosCliente.endereco_logradouro || null, dadosCliente.endereco_numero || null, dadosCliente.endereco_complemento || null, dadosCliente.endereco_bairro || null, dadosCliente.endereco_cidade || null, dadosCliente.endereco_uf || null, dadosCliente.endereco_cep || null];
        const { rows } = await db.query(queryText, values);
        res.status(201).json({ message: 'Cliente criado com sucesso!', cliente: rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

// --- FUNÇÃO DE UPDATE CORRIGIDA ---
const updateClientes = async (req, res) => {
    const { id } = req.params;
    const dadosCliente = req.body;

    const resultadoValidacao = validarDadosCliente(dadosCliente);
    if (!resultadoValidacao.ok) {
        return res.status(400).json({ error: resultadoValidacao.error });
    }

    try {
        const { nome, cpf_cnpj, email, data_nascimento, comentario, tipo_pessoa, telefone1, telefone2, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_uf, endereco_cep } = dadosCliente;

        const queryText = `
            UPDATE clientes SET 
                nome = $1, cpf_cnpj = $2, email = $3, data_nascimento = $4, comentario = $5, 
                tipo_pessoa = $6, telefone1 = $7, telefone2 = $8, endereco_logradouro = $9, 
                endereco_numero = $10, endereco_complemento = $11, endereco_bairro = $12, 
                endereco_cidade = $13, endereco_uf = $14, endereco_cep = $15 
            WHERE codigo = $16 RETURNING *;`;
        
        const values = [
            nome, cpf_cnpj, email, data_nascimento, comentario || null, tipo_pessoa, 
            telefone1, telefone2 || null, endereco_logradouro || null, endereco_numero || null, 
            endereco_complemento || null, endereco_bairro || null, endereco_cidade || null, 
            endereco_uf || null, endereco_cep || null, id
        ];

        const { rows, rowCount } = await db.query(queryText, values);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado para atualização.' });
        }
        
        res.status(200).json({ message: 'Cliente atualizado com sucesso!', cliente: rows[0] });

    } catch (err) {
        res.status(500).send({ error: 'Erro ao atualizar cliente.', details: err.message });
    }
}

const deleteClientes = async (req, res) => {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de cliente foi fornecido para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));

    try {
        const queryText = 'DELETE FROM clientes WHERE codigo = ANY($1::int[])';
        const result = await db.query(queryText, [idInt]);
        res.status(200).json({ message: `${result.rowCount} cliente(s) excluído(s) com sucesso.` });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({ message: 'Não é possível excluir: um ou mais clientes selecionados possuem contas a receber atreladas.' });
        }
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    getClientes,
    getClienteById,
    createClientes,
    updateClientes,
    deleteClientes
};
