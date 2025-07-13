const express = require('express');
const router = express.Router();

// O require do controller vem primeiro
const modelosController = require('../controllers/modelosController');

// A rota usa a função importada
router.get('/', modelosController.getModelosContratos);

router.post('/', modelosController.createModeloContrato);

router.put('/:id' , modelosController.updateModeloContrato);

router.delete('/' , modelosController.deleteModelosContratos);

// Certifique-se que esta é a única linha de exportação no arquivo
module.exports = router;