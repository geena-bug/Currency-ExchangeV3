const express = require('express');
const router = express.Router();
const userController = require('../controllers/users-controller')
const validation = require('../middelware/user-validations')
const checkRole = require('../middelware/checkRole')
const passport = require('../lib/passport');
const userPermissionChecker = checkRole()
/* Define user routes. */
//Load dashboard
router.get('/',passport.authenticate('jwt', { session: false }), userPermissionChecker(['user', 'admin']), userController.dashboard);
router.get('/me',passport.authenticate('jwt', { session: false }), userPermissionChecker(['user', 'admin']), userController.me);
router.get('/country-list',passport.authenticate('jwt', { session: false }), userPermissionChecker(['user', 'admin']), userController.countryCurrencyList);
//Load conversions page
router.get('/conversions', passport.authenticate('jwt', { session: false }), userPermissionChecker(['user', 'admin']), userController.listConversions);

//Load live exchange page
router.get('/live-exchange', passport.authenticate('jwt', { session: false }), userPermissionChecker(['user', 'admin']), userController.liveExchange);

router.delete('/delete-conversions/:conversionId', passport.authenticate('jwt', { session: false }), userPermissionChecker(['user', 'admin']), userController.deleteHistory);
//Submit the form on the update account page
router.put('/update-account',passport.authenticate('jwt', { session: false }), [validation.updateAccountValidation], userPermissionChecker(['user', 'admin']), userController.updateAccount);
//Convert currency
router.post('/convert-currency', passport.authenticate('jwt', { session: false }),[validation.conversionValidation], userPermissionChecker(['user', 'admin']), userController.convertCurrency);
router.put('/update-password', passport.authenticate('jwt', { session: false }),[validation.updatePasswordValidation], userPermissionChecker(['user', 'admin']), userController.updatePassword);
//Export the router and its content(routes) to anywhere it will be used.
module.exports = router;
