var router = require('express').Router()
/**
 * =====================================================================
 * * HOME ROUTE
 * =====================================================================
 */

// % Login Controller
var testController = require('../controllers/home/home.controller')

router.get('/hello_world', testController.testHelloWorld)

// * Export Module to use in ../index.js
module.exports = router
