const express = require('express');
const router = express.Router();

const statisticsController = require('../controllers/statsController');

// Aggregation with GROUP BY
router.get(
    '/statistics/average-spending-by-category',
    statisticsController.getAverageSpendingByPassengerCategory
);

// Aggregation with HAVING
router.get(
    '/statistics/gates-more-than-100-events',
    statisticsController.getGatesWithMoreThan100Events
);

// Nested Aggregation with GROUP BY
router.get(
    '/statistics/stations-more-than-average-routes',
    statisticsController.getStationsServedByMoreThanAverageRoutes
);

// Division
router.get(
    '/statistics/passengers-with-all-pass-types',
    statisticsController.getPassengersWithAllPassTypesCount
);

module.exports = router;