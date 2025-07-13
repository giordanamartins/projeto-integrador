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

const updateUsuario = async (req, res) => {
    const { id } = req.params;
    
    const usuarioExiste = await db.oneOrNone("SELECT id FROM usuarios WHERE codigo = $1;", [id]);
    if (!usuarioExiste) {
        return res.status(404).send({ error: 'Usuário não encontrada.' });
    }
    
    try {
        const { nome, email, senha, tipo_usuario, numero_oab } = req.body;

        await db.none(
        'UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_usuario = $4, numero_oab = $5 WHERE codigo = $6;'
        [nome, email, senha, tipo_usuario, numero_oab, id]
        );

        return res.status(200).send("Usuário atualizado com sucesso!");
    } 
    catch (err) {
        return res.status(500).send({ error: 'Erro ao atualizar usuário.', details: err.message });
    }
}

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
    
        // result.rowCount contém o número de linhas que foram deletadas
        res.status(200).json({ message: `${result.rowCount} usuário(s) excluído(s) com sucesso.` });
        } 
    catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

module.exports = {
    createUser,
    getAdvogados,
    updateUsuario,
    deleteUsuario
};