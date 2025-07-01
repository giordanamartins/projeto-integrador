const express = require('express');
const router = express.Router();


const creceberController = require('../controllers/creceberController');

router.get('/', creceberController.getContasReceber);
router.get('/hoje', creceberController.getContasReceberHoje);


module.exports = router;