const express = require('express');
const controller = require('../controllers/databaseController');
const router = express.Router();

router.get(
    '/database/check-db-connection',
    controller.checkConnection
);

router.post(
    '/database/reset-db',
    controller.resetDatabase
);

module.exports = router;