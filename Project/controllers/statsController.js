const statisticsService = require('../services/statisticsService');

// Aggregation with GROUP BY

async function getAverageSpendingByPassengerCategory(req, res) {
    const result =
        await statisticsService.getAverageSpendingByPassengerCategory();

    return res.json(result);

}

// Aggregation with HAVING

async function getGatesWithMoreThan100Events(req, res) {
    const result =
        await statisticsService.getGatesWithMoreThan100Events();

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
    getGatesWithMoreThan100Events,
    getStationsServedByMoreThanAverageRoutes,
    getPassengersWithAllPassTypesCount
};