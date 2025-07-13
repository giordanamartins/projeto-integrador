const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    // Pega a senha junto com os outros dados
    console.log("--- DADOS RECEBIDOS NO BACKEND --- \nCorpo da Requisição (req.body):", req.body);
    const { nome, email, senha, tipo_usuario, numero_oab } = req.body;
    
    if (!nome || !email || !senha || !tipo_usuario) {
        return res.status(400).json({ message: 'Nome, email, senha e tipo de usuário são obrigatórios.' });
    }

     if (tipo_usuario === 'advogado' && !numero_oab) {
        return res.status(400).json({ message: 'O número da OAB é obrigatório para o tipo de usuário "advogado".' });
    }

    try {
        // "hasheia" a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Salva a senha hasheada no banco
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

module.exports = {
    createUser,
    getAdvogados
};