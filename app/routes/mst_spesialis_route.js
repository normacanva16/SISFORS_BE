const dotEnv = require('dotenv');
const { Router } = require('express');

const SpesialisController = require('../controllers/MSTSpesialisController');
const { verifyToken } = require('../helpers/authentication-jwt');
const authorize = require('../helpers/authorize');

const { validate } = require('../helpers/utilities/validate');

const router = Router();
dotEnv.config();

router.get('', SpesialisController.list);
router.post('',SpesialisController.create);
router.delete('/:id', verifyToken, authorize.permit(['superadmin']), SpesialisController.delete);

module.exports = router;
