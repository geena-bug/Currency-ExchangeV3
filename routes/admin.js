const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller')
const checkRole = require('../middelware/checkRole')
const passport = require('../lib/passport');
const adminPermissionChecker = checkRole('admin')
/* Define user routes. */
//Load dashboard
router.get('/list-users',passport.authenticate('jwt', { session: false }), adminPermissionChecker, adminController.listUsers);

module.exports = router;
