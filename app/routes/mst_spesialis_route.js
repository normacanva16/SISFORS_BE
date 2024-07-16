const dotEnv = require('dotenv');
const { Router } = require('express');

const SpesialisController = require('../controllers/MSTSpesialisController');

const router = Router();
dotEnv.config();

router.get('', SpesialisController.list);
router.post('',SpesialisController.create);

module.exports = router;
