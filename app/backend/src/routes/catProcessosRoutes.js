const express = require('express');
const router = express.Router();
const catProcessosController = require('../controllers/catProcessosController');



router.get('/', catProcessosController.getCatProcesso);




router.get('/:id', catProcessosController.getCatProcessoById);



router.post('/', catProcessosController.createCatProcesso);



router.put('/:id', catProcessosController.updateCatProcesso);



router.delete('/', catProcessosController.deleteCatProcesso);



router.post('/:id/clone', catProcessosController.cloneCatProc);


module.exports = router;

