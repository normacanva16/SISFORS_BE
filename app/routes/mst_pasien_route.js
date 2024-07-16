const dotEnv = require('dotenv');
const { Router } = require('express');

const PasienController = require('../controllers/MSTPasienController');
const { verifyToken } = require('../helpers/authentication-jwt');
const authorize = require('../helpers/authorize');

const { validate } = require('../helpers/utilities/validate');

const router = Router();
dotEnv.config();

router.get('', PasienController.list);
router.post('',PasienController.create);
router.delete('/:id', verifyToken, authorize.permit(['admin']), PasienController.delete);

module.exports = router;
