const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.getUsuarios);

router.post('/', usuarioController.createUser);

router.get('/advogados', usuarioController.getAdvogados);

router.get('/:id', usuarioController.getUsuarioById);

router.patch('/:id/senha', usuarioController.updateSenhaUsuario);

router.delete('/', usuarioController.deleteUsuario);

module.exports = router;