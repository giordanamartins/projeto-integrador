const express = require('express');
const router = express.Router();

const creceberController = require('../controllers/creceberController');

router.get('/', creceberController.getContasReceber);
router.get('/hoje', creceberController.getContasReceberHoje);
router.get('/relatorio-areceber', creceberController.relatorioContasAReceber);
router.get('/relatorio-recebimentos', creceberController.relatorioRecebimentos);

router.post('/', creceberController.createContasReceber);

router.put('/', creceberController.updateContasReceber);

router.delete('/', creceberController.deleteContasReceber);

module.exports = router;
