const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller')
const checkRole = require('../middelware/checkRole')
const passport = require('../lib/passport');
const adminPermissionChecker = checkRole()
/* Define user routes. */
//Load dashboard
router.get('/list-users',passport.authenticate('jwt', { session: false }), adminPermissionChecker(['admin']), adminController.listUsers);
router.delete('/delete-user/:id',passport.authenticate('jwt', { session: false }), adminPermissionChecker(['admin']), adminController.deleteUser);

module.exports = router;
