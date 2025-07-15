const express = require('express');
const router = express.Router();


const clienteController = require('../controllers/clienteController');


router.get('/', clienteController.getClientes);

router.get('/:id', clienteController.getClienteById);

router.post('/', clienteController.createClientes);

router.put('/:id' , clienteController.updateClientes);

router.delete('/' , clienteController.deleteClientes);


module.exports = router;
