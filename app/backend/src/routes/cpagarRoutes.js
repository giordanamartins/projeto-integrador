const express = require('express');
const router = express.Router();

const cpagarController = require('../controllers/cpagarController');

router.get('/', cpagarController.getContasPagar);
router.get('/hoje', cpagarController.getContasPagarHoje);

router.post('/', cpagarController.createContasPagar);

router.put('/:id', cpagarController.updateContasPagar);

router.delete('/', cpagarController.deleteContasPagar);

module.exports = router;
