const express = require('express');
const router = express.Router();
const validations = require('../middelware/auth-validations')
const controllers = require('../controllers/auth-controller')

/* Submit signup and login page. */
router.post('/sign-up',[validations.signUpValidation], controllers.processSignup);

router.post('/login', [validations.loginValidation], controllers.processLogin);

//Export router contents
module.exports = router;
