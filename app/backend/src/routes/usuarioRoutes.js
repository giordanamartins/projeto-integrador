const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');


router.post('/', usuarioController.createUser);

router.get('/', usuarioController.getAdvogados);

router.put('/', usuarioController.updateUsuario);

router.delete('/', usuarioController.deleteUsuario);

module.exports = router;