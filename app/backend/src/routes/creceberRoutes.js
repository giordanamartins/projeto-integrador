const express = require('express');
const router = express.Router();


const creceberController = require('../controllers/creceberController');


router.get('/', creceberController.getContasReceber);

router.get('/hoje', creceberController.getContasReceberHoje);

router.post('/lancar-parcelas', creceberController.lancarParcelas);


router.patch('/status', creceberController.updateStatusContasReceber);



module.exports = router;
