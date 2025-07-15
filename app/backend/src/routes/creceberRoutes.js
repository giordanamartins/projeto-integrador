const express = require('express');
const router = express.Router();


const creceberController = require('../controllers/creceberController');


router.get('/', creceberController.getContasReceber);

router.get('/hoje', creceberController.getContasReceberHoje);

router.post('/lancar-parcelas', creceberController.lancarParcelas);


router.patch('/status', creceberController.updateStatusContasReceber);

router.delete('/', creceberController.deleteContasReceber);

router.get('/relatorio-areceber', creceberController.relatorioContasAReceber);

router.get('/relatorio-recebimentos', creceberController.relatorioRecebimentos);

module.exports = router;
