const express = require('express');
const router = express.Router();
const validations = require('../middelware/auth-validations')
const controllers = require('../controllers/home-controller')

/* GET Signup and login page. */
router.get('/',async function (req, res, next) {
    // console.log(await User.findAll());
    res.json({ title: 'Express' });
})

//Export router contents
module.exports = router;
