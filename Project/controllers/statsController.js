const statisticsService = require('../services/statsService');

// Aggregation with GROUP BY

async function getAverageSpendingByPassengerCategory(req, res) {
    const result =
        await statisticsService.getAverageSpendingByPassengerCategory();

    return res.json(result);

}

// Aggregation with HAVING

async function getStationsWithMoreThan300Events(req, res) {
    const result =
        await statisticsService.getStationsWithMoreThan300Events();

    return res.json(result);

}

// Nested Aggregation with GROUP BY

async function getStationsServedByMoreThanAverageRoutes(req, res) {
    const result =
        await statisticsService.getStationsServedByMoreThanAverageRoutes();

    return res.json(result);

}

// Division

async function getPassengersWithAllPassTypesCount(req, res) {
    const result =
        await statisticsService.getPassengersWithAllPassTypesCount();

    return res.json({
        passengerCount: result
    });

}

module.exports = {
    getAverageSpendingByPassengerCategory,
    getStationsWithMoreThan300Events,
    getStationsServedByMoreThanAverageRoutes,
    getPassengersWithAllPassTypesCount
};