const express = require('express');
const router = express.Router();
const processosController = require('../controllers/processosController');


router.get('/', processosController.getProcessos);

router.get('/status-count', processosController.getProcessosStCount);


router.get('/:id/dados-lancamento', processosController.getProcessoParaLancamento);


router.get('/:id/contrato', processosController.gerarContratoTexto);


router.get('/relatorio', processosController.relatorioProcessos);


router.get('/:id', processosController.getProcessoById);


router.post('/', processosController.createProcesso);


router.put('/:id', processosController.updateProcesso);


router.delete('/', processosController.deleteProcesso);


router.patch('/status', processosController.updateStatusProcesso);

module.exports = router;




