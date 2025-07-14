const express = require('express');
const router = express.Router();

const processosController = require('../controllers/processosController');


router.get('/', processosController.getProcessos);
router.get('/gerar-contrato-texto/:id', processosController.gerarContratoTexto);
//router.get('/relatorio', processosController.relatorioProcessos);

router.post('/', processosController.createProcesso);

router.put('/:id' , processosController.updateProcesso);

router.delete('/' , processosController.deleteProcesso);

router.get('/:id/dados-lancamento', processosController.getProcessoParaLancamento);


module.exports = router;