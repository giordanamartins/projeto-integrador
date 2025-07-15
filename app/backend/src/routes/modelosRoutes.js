const express = require('express');
const router = express.Router();


const modelosController = require('../controllers/modelosController');
const processosController = require('../controllers/processosController');


router.get('/', modelosController.getModelosContratos);

router.get('/:id/contrato', processosController.gerarContratoTexto);

router.post('/', modelosController.createModeloContrato);

router.put('/:id' , modelosController.updateModeloContrato);

router.delete('/' , modelosController.deleteModelosContratos);


module.exports = router;