const dotEnv = require('dotenv');
const { Router } = require('express');

//Validation
const { validateCreateUser, validateLogin, validateUpdateUser } = require('../helpers/validator');

const { validate } = require('../helpers/utilities/validate');

const UserController = require('../controllers/UserController');
const { verifyToken } = require('../helpers/authentication-jwt');
const authorize = require('../helpers/authorize');

const router = Router();
dotEnv.config();

router.post('/admin', validate(validateCreateUser), UserController.createUser);
router.post('/login', validate(validateLogin), UserController.login);
router.get('/admin', UserController.listUser);
router.delete('/:id', verifyToken, authorize.permit(['admin']), UserController.delete);
router.get('/:id/admin', UserController.viewUser);
module.exports = router;
