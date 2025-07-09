const express = require('express');
const router = express.Router();

// O require do controller vem primeiro
const clienteController = require('../controllers/clienteController');

// A rota usa a função importada
router.get('/', clienteController.getClientes);

router.get('/:id', clienteController.getClienteById);

router.post('/', clienteController.createClientes);

router.put('/:id' , clienteController.updateClientes);

router.delete('/' , clienteController.deleteClientes);

// Certifique-se que esta é a única linha de exportação no arquivo
module.exports = router;
