const express = require('express');
const router = express.Router();

// O require do controller vem primeiro
const catProcessosController = require('../controllers/catProcessosController');

// A rota usa a função importada
router.get('/', catProcessosController.getCatProcesso);

router.post('/', catProcessosController.createCatProcesso);

router.put('/:id' , catProcessosController.updateCatProcesso);

router.delete('/' , catProcessosController.deleteCatProcesso);

// Certifique-se que esta é a única linha de exportação no arquivo
module.exports = router;