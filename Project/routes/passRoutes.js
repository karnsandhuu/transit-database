const express = require('express');
const controller = require('../controllers/passController');
const router = express.Router();

router.post(
    '/passengers/:passengerId/passes',
    controller.purchasePass
);

router.post(
    '/passes/:ticketId/top-up',
    controller.topUpTimedPass
);

router.get(
    '/passengers/:passengerId/passes',
    controller.getPassengerPasses
);

router.delete(
    '/passengers/:passengerId/passes/:passId',
    controller.deletePass
);

module.exports = router;