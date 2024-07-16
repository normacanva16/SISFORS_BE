const dotEnv = require('dotenv');
const { Router } = require('express');

const DokterController = require('../controllers/MSTDokterController');

const router = Router();
dotEnv.config();

router.get('', DokterController.list);
router.post('',DokterController.create);

module.exports = router;
