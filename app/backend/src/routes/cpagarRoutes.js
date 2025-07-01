const express = require('express');
const router = express.Router();


const cpagarController = require('../controllers/cpagarController');


router.get('/', cpagarController.getContasPagar);
router.get('/hoje', cpagarController.getContasPagarHoje);


module.exports = router;
