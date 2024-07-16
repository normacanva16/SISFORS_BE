const dotEnv = require('dotenv');
const { Router } = require('express');

const JadwalPeriksaController = require('../controllers/TRXJadwalPeriksaController');

const router = Router();
dotEnv.config();

router.get('', JadwalPeriksaController.list);
router.post('',JadwalPeriksaController.create);

module.exports = router;
