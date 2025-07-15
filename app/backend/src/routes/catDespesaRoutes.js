const express = require('express');
const router = express.Router();
const catDespesaController = require('../controllers/catDespesaController');


router.get('/', catDespesaController.getCatDespesa);


router.get('/:id', catDespesaController.getCatById);


router.post('/', catDespesaController.createCatDespesa);


router.post('/:id/clone', catDespesaController.cloneCatDespesa);


router.put('/:id', catDespesaController.updateCatDespesa);


router.delete('/', catDespesaController.deleteCatDespesa);

module.exports = router;
