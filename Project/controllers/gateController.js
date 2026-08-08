const gateService = require('../services/gateService');


async function getGatesByStation(req, res) {
    const stationId = req.params.stationId;

    const result = await gateService.getGatesByStation(
        stationId
    );

    return res.json(result);
}


async function enterGate(req, res) {
    const gateId = req.params.gateId;
    const ticketId = req.body.ticketId;

    const result = await gateService.enterGate(
        ticketId,
        gateId
    );

    if (!result.success) {
        return res.status(400).json({
            success: false
        });
    }

    return res.json(result);
}


async function exitGate(req, res) {
    const gateId = req.params.gateId;
    const ticketId = req.body.ticketId;

    const result = await gateService.exitGate(
        ticketId,
        gateId
    );

    if (!result.success) {
        return res.status(400).json({
            success: false
        });
    }

    return res.json(result);
}


module.exports = {
    getGatesByStation,
    enterGate,
    exitGate
};