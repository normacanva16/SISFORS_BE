const dotEnv = require('dotenv');
const { Router } = require('express');

const DokterController = require('../controllers/MSTDokterController');
const { verifyToken } = require('../helpers/authentication-jwt');
const authorize = require('../helpers/authorize');

const { validate } = require('../helpers/utilities/validate');

const router = Router();
dotEnv.config();

router.get('', DokterController.list);
router.post('',DokterController.create);
router.delete('/:id', verifyToken, authorize.permit(['superadmin']), DokterController.delete);

module.exports = router;
