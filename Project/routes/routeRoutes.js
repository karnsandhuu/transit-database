const express = require('express');
const routeController = require('../controllers/routeController');

const router = express.Router();


// Route Services

// Get route by route number
router.get(
    '/routes/:routeNumber',
    routeController.getRouteByNumber
);


// Schedule Services

// Get all schedules for a route
router.get(
    '/routes/:routeNumber/schedules',
    routeController.getSchedulesByRouteNumber
);


// Route Stop Services

// Get all route stops for a route
router.get(
    '/routes/:routeNumber/stops',
    routeController.getRouteStopsByRouteNumber
);


module.exports = router;