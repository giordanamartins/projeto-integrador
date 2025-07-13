const express = require('express');
const router = express.Router();
const catDespesaController = require('../controllers/catDespesaController');

// Rota para listar todas e buscar
router.get('/', catDespesaController.getCatDespesa);

// Rota para buscar UMA categoria pelo ID
router.get('/:id', catDespesaController.getCatById);

// Rota para criar uma nova categoria
router.post('/', catDespesaController.createCatDespesa);

// Rota para clonar uma categoria
router.post('/:id/clone', catDespesaController.cloneCatDespesa);

// Rota para atualizar uma categoria
router.put('/:id', catDespesaController.updateCatDespesa);

// Rota para deletar múltiplas categorias
router.delete('/', catDespesaController.deleteCatDespesa);

module.exports = router;
