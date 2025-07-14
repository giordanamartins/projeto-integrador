const express = require('express');
const router = express.Router();
const catProcessosController = require('../controllers/catProcessosController');

// Rota para listar todas as categorias e fazer a busca
// GET /api/catProcessos
router.get('/', catProcessosController.getCatProcesso);

// --- ROTA PARA BUSCAR UMA CATEGORIA ESPECÍFICA ---
// Esta é a rota que estava faltando ou com erro.
// GET /api/catProcessos/123
router.get('/:id', catProcessosController.getCatProcessoById);

// Rota para criar uma nova categoria
// POST /api/catProcessos
router.post('/', catProcessosController.createCatProcesso);

// Rota para atualizar uma categoria
// PUT /api/catProcessos/123
router.put('/:id', catProcessosController.updateCatProcesso);

// Rota para deletar uma ou mais categorias
// DELETE /api/catProcessos
router.delete('/', catProcessosController.deleteCatProcesso);

// Rota para clonar uma categoria
// POST /api/catProcessos/123/clone
//router.post('/:id/clone', catProcessosController.cloneCatProcesso);


module.exports = router;


