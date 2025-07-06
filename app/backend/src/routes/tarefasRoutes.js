const express = require('express');
const router = express.Router();

// O require do controller vem primeiro
const tarefasController = require('../controllers/tarefasController');

// A rota usa a função importada
router.get('/', tarefasController.getTarefas);

router.post('/', tarefasController.createTarefa);

router.put('/:id' , tarefasController.updateTarefa);

router.delete('/' , tarefasController.deleteTarefa);

// Certifique-se que esta é a única linha de exportação no arquivo
module.exports = router;