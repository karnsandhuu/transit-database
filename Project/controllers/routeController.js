const routeService = require('../services/routeService');


// Route Services


async function getRouteByNumber(req, res) {
    const routeNumber = req.params.routeNumber;

    const result = await routeService.getRouteByNumber(
        routeNumber
    );

    if (!result) {
        return res.status(404).json({
            success: false
        });
    }

    return res.json(result);
}


// Schedule Services

async function getSchedulesByRouteNumber(req, res) {
    const routeNumber = req.params.routeNumber;

    const result = await routeService.getSchedulesByRouteNumber(
        routeNumber
    );

    return res.json(result);
}


// Route Stop Services


async function getRouteStopsByRouteNumber(req, res) {
    const routeNumber = req.params.routeNumber;

    const result = await routeService.getRouteStopsByRouteNumber(
        routeNumber
    );

    return res.json(result);
}


module.exports = {
    getRouteByNumber,
    getSchedulesByRouteNumber,
    getRouteStopsByRouteNumber
};