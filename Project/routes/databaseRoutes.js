const express = require('express');
const controller = require('../controllers/databaseController');
const router = express.Router();

router.get(
    '/database/check-db-connection',
    controller.checkConnection
);

router.post(
    '/database/reset-db',
    controller.rePopulateDatabase
);

router.post(
    '/database/clear-db',
    controller.clearDatabase
);

router.post(
    '/database/drop-db',
    controller.dropDatabase
);



module.exports = router;