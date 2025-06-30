const express = require('express');
const router = express.Router();


const creceberController = require('../controllers/creceberController');
console.log("2. [Routes] Conteúdo importado de creceberController:");

router.get('/', creceberController.getContasReceber);


module.exports = router;