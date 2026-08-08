const express = require('express');
const controller = require('../controllers/demotableController');
const router = express.Router();

router.get(
    '/check-db-connection',
    controller.checkConnection
);

router.get(
    '/demotable',
    controller.fetchDemotable
);

router.post(
    '/initiate-demotable',
    controller.initiateDemotable
);

router.post(
    '/insert-demotable',
    controller.insertDemotable
);

router.post(
    '/update-name-demotable',
    controller.updateNameDemotable
);

router.get(
    '/count-demotable',
    controller.countDemotable
);


module.exports = router;