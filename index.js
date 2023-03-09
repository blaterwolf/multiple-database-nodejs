/**
 * ================================================================
 * * AZURE UPLOAD API - INDEX.JS CONFIGURATIONS
 * ================================================================
 */

// % Import Important Modules
const express = require('express')
const dotenv = require('dotenv')
const {
    failedMessage,
    syncSuccessMessage,
    syncFailedMessage,
    attemptingToConnect,
    attemptingToSync,
    noSyncMessage,
    listeningMessage,
} = require('./db_message')
const jwt = require('jsonwebtoken')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const { userLogger } = require('./helper/logger')

// % Reference Models
const DB_USERS = require('./models/users')
const DB_OMSSS = require('./models/omsss')
const DB_ODRTS = require('./models/odrts')

// % Initialize Express
var app = express()

// % Express Shenanigans
// ? parse requests of content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// ? parse requrests of content-type application/json
app.use(express.json())

// % .env config
dotenv.config()

// % PORT value
const PORT = process.env.PORT || 3700

// % Middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    const { method, socket, url, hostname } = req
    const { remoteAddress, remoteFamily } = socket

    // ? you can check session here.
    const log = {
        method,
        remoteAddress,
        remoteFamily,
        hostname,
        url,
    }
    userLogger.info(JSON.stringify(log, null, 2))

    next()
})

/**
 * ================================================================
 * * ROUTES
 * ================================================================
 */

const MAIN_API_ROUTE = '/multi_db/v1/'

// % Home Route
// >> localhost:3700/multi_db/v1/
app.use(`${MAIN_API_ROUTE}`, require('./routes/home.route.js'))

/**
 * ================================================================
 * * DATABASE
 * ================================================================
 */

databases = [DB_USERS, DB_OMSSS, DB_ODRTS]

const db_log = process.env.ENABLE_DB_LOG === 'true'
const sync_log = process.env.ENABLE_SYNC_MODEL_LOG === 'true'

const connectToDB = async db => {
    db.sequelize.authenticate().catch(err => {
        console.error(failedMessage(err))
    })
}

const syncToDB = async db => {
    db.sequelize.sync({ alter: true }).catch(err => console.error(syncFailedMessage(err)))
}

const connectAndSync = async () => {
    // Connect to all databases
    const connections = databases.map(connectToDB)
    await Promise.all(connections)

    // Sync all models
    const syncs = databases.map(syncToDB)
    await Promise.all(syncs)

    // Print connection logs
    db_log ? userLogger.info(attemptingToConnect()) : {}
    connections.forEach((connection, index) => {
        if (connection && db_log) console.log(`✅ ${databases[index].name} is connected!`)
    })

    // Print sync logs
    if (process.env.SEQUELIZE_ALTER_SYNC === 'true') {
        sync_log ? userLogger.info(attemptingToSync()) : {}
        syncs.forEach((sync, index) => {
            if (sync && sync_log)
                console.log(`✅ ${databases[index].name} Models have been synced to the database!`)
        })
    } else {
        userLogger.info(noSyncMessage())
    }

    app.listen(PORT, () => {
        userLogger.info(listeningMessage(PORT, MAIN_API_ROUTE))
    })
}

/**
 * ================================================================
 * * APP LISTENING...
 * ================================================================
 */

// Start the connection and syncing process
connectAndSync()
