const express = require('express');
const controller = require('../controllers/passengerController');

const router = express.Router();

router.post(
    '/passengers',
    controller.createPassenger
);

router.get(
    '/passengers/:passengerId',
    controller.getPassenger
);

router.patch(
    '/passengers/:passengerId/type',
    controller.updatePassengerCategory
);

module.exports = router;
