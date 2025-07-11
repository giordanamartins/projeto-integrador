const express = require('express');
const router = express.Router();

// O require do controller vem primeiro
const catDespesaController = require('../controllers/catDespesaController');

// A rota usa a função importada
router.get('/', catDespesaController.getCatDespesa);

router.get('/:id', catDespesaController.getCatById);

router.post('/', catDespesaController.createCatDespesa);

router.post('/:id/clone', catDespesaController.cloneCatDespesa);

router.put('/:id' , catDespesaController.updateCatDespesa);

router.delete('/' , catDespesaController.deleteCatDespesa);

// Certifique-se que esta é a única linha de exportação no arquivo
module.exports = router;