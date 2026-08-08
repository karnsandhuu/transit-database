const express = require('express');
const gateController = require('../controllers/gateController');
const router = express.Router();

// Get all gates at a station
router.get(
    '/stations/:stationId/gates',
    gateController.getGatesByStation
);

// Enter through a gate
router.post(
    '/gates/:gateId/enter',
    gateController.enterGate
);

// Exit through a gate
router.post(
    '/gates/:gateId/exit',
    gateController.exitGate
);
module.exports = router;