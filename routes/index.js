const express = require('express');
const router = express.Router();
const validations = require('../middelware/auth-validations')
const controllers = require('../controllers/home-controller')

/* GET Signup and login page. */
router.get('/',controllers.home);

//Export router contents
module.exports = router;
