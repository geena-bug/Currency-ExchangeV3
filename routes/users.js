const express = require('express');
const router = express.Router();
const userController = require('../controllers/users-controller')
const validation = require('../middelware/user-validations')
const checkRole = require('../middelware/checkRole')
const passport = require('../lib/passport');
const userPermissionChecker = checkRole('user')
/* Define user routes. */
//Load dashboard
router.get('/',passport.authenticate('jwt', { session: false }), userPermissionChecker, userController.dashboard);
router.get('/me',passport.authenticate('jwt', { session: false }), userPermissionChecker, userController.me);
router.get('/country-list',passport.authenticate('jwt', { session: false }), userPermissionChecker, userController.countryCurrencyList);
//Load conversions page
router.get('/conversions', passport.authenticate('jwt', { session: false }), userPermissionChecker, userController.listConversions);

//Load live exchange page
router.get('/live-exchange', passport.authenticate('jwt', { session: false }), userPermissionChecker, userController.liveExchange);

router.delete('/delete-conversions/:conversionId', passport.authenticate('jwt', { session: false }), userPermissionChecker, userController.deleteHistory);
//Submit the form on the update account page
router.put('/update-account',passport.authenticate('jwt', { session: false }), [validation.updateAccountValidation], userPermissionChecker, userController.updateAccount);
//Convert currency
router.post('/convert-currency', passport.authenticate('jwt', { session: false }),[validation.conversionValidation], userPermissionChecker, userController.convertCurrency);
router.put('/update-password', passport.authenticate('jwt', { session: false }),[validation.updatePasswordValidation], userPermissionChecker, userController.updatePassword);
//Export the router and its content(routes) to anywhere it will be used.
module.exports = router;
