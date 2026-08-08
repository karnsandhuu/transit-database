const express = require('express');
const stationController = require('../controllers/stationController');

const router = express.Router();

// Get all zones
router.get(
    '/zones',
    stationController.getAllZones
);

// Station Routes

// Get all stations
router.get(
    '/stations',
    stationController.getAllStations
);

// Get all stations in a specific zone
router.get(
    '/zones/:zoneNumber/stations',
    stationController.getStationsByZone
);


module.exports = router;

