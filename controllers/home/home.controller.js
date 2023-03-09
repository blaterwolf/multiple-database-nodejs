/**
 * =====================================================================
 * * HOME CONTROLLER
 * =====================================================================
 * Controller for Login
 * =====================================================================
 */

const db_Users = require('../../models/users')
const { errResponse, emptyDataResponse, dataResponse } = require('../../helper/controller.helper')
const crypto = require('crypto')
const dotenv = require('dotenv')

// env config
require('dotenv').config()

exports.testHelloWorld = async (req, res) => {
    console.log('Hello World')
    res.status(200).send('Hello World')
}
