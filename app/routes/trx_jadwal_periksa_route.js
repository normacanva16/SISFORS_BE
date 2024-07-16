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
router.delete('/:id', verifyToken, authorize.permit(['superadmin']), JadwalPeriksaController.delete);
module.exports = router;
