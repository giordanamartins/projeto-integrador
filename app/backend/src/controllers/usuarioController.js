const db = require('../config/db');
const bcrypt = require('bcrypt');

const getUsuarios = async (req, res) => {
    try {
        const queryText = "SELECT codigo, nome, email, tipo_usuario FROM usuarios ORDER BY nome ASC";
        const { rows } = await db.query(queryText);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query('SELECT codigo, nome, email, tipo_usuario, numero_oab FROM usuarios WHERE codigo = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};


const createUser = async (req, res) => {

    console.log("--- DADOS RECEBIDOS NO BACKEND --- \nCorpo da Requisição (req.body):", req.body);
    const { nome, email, senha, tipo_usuario, numero_oab } = req.body;
    if (!nome || !email || !senha || !tipo_usuario) {
        return res.status(400).json({ message: 'Nome, email, senha e tipo de usuário são obrigatórios.' });
    }

    if (tipo_usuario === 'advogado' && !numero_oab) {
        return res.status(400).json({ message: 'O número da OAB é obrigatório para o tipo de usuário "advogado".' });
    }

    try {

        const hashedPassword = await bcrypt.hash(senha, 10);


        const queryText = 'INSERT INTO usuarios (nome, email, senha, tipo_usuario, numero_oab ) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [nome, email, hashedPassword, tipo_usuario, numero_oab]; // <-- Usando a senha hasheada
        
        const { rows } = await db.query(queryText, values);
        res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: rows[0] });
    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ message: 'Este email já está em uso.' });
        }
        console.error('Erro ao inserir usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const getAdvogados = async (req, res) => {
    try {
        const queryText = "SELECT codigo, nome FROM usuarios WHERE tipo_usuario = 'A' ORDER BY nome ASC";
        const { rows } = await db.query(queryText);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar advogados:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const updateSenhaUsuario = async (req, res) => {
    const { id } = req.params;
    const { senha } = req.body;

    if (!senha || senha.length < 6) { // Exemplo de validação de senha
        return res.status(400).json({ message: 'A nova senha é obrigatória e deve ter no mínimo 6 caracteres.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const queryText = 'UPDATE usuarios SET senha = $1 WHERE codigo = $2';
        const { rowCount } = await db.query(queryText, [hashedPassword, id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
        }
        res.status(200).json({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar senha do usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const deleteUsuario = async (req, res) => {
    const {ids} = req.body;
    
    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'Nenhum ID de usuário foi fornecido para exclusão.' });
    }
    const idInt = ids.map(id => parseInt(id, 10));
    
    console.log("Array convertido para inteiros:", idInt);
    
    try {
        const queryText = 'DELETE FROM usuarios WHERE codigo = ANY($1::int[])';

        const result = await db.query(queryText, [idInt]);
    

        res.status(200).json({ message: `${result.rowCount} usuário(s) excluído(s) com sucesso.` });
        } 
    catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({ message: 'Não é possível excluir, o usuário pode estar vinculado a um processo' });
        }
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

module.exports = {
    createUser,
    getAdvogados,
    updateSenhaUsuario,
    deleteUsuario,
    getUsuarios,
    getUsuarioById
};