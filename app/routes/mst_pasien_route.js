const dotEnv = require('dotenv');
const { Router } = require('express');

const PasienController = require('../controllers/MSTPasienController');

const router = Router();
dotEnv.config();

router.get('', PasienController.list);
router.post('',PasienController.create);

module.exports = router;
