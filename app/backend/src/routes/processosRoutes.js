const express = require('express');
const router = express.Router();

// O require do controller vem primeiro
const processosController = require('../controllers/processosController');

// A rota usa a função importada
router.get('/', processosController.getProcessos);

router.post('/', processosController.createProcesso);

router.put('/:id' , processosController.updateProcesso);

router.delete('/' , processosController.deleteProcesso);

// Certifique-se que esta é a única linha de exportação no arquivo
module.exports = router;