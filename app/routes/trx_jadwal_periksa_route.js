const dotEnv = require('dotenv');
const { Router } = require('express');

const JadwalPeriksaController = require('../controllers/TRXJadwalPeriksaController');
const { verifyToken } = require('../helpers/authentication-jwt');
const authorize = require('../helpers/authorize');

const { validate } = require('../helpers/utilities/validate');

const router = Router();
dotEnv.config();

router.get('', JadwalPeriksaController.list);
router.post('',JadwalPeriksaController.create);
router.delete('/:id', verifyToken, authorize.permit(['admin']), JadwalPeriksaController.delete);
router.get('/list-pasien-by-dokter/:dokter_id', JadwalPeriksaController.listPasienByDokter);
router.get('/list-periksa-by-pasien/:pasien_id', JadwalPeriksaController.listJadwalPeriksaByPasien);
module.exports = router;
