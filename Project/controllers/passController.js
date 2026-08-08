const passService = require('../services/passService');

async function purchasePass(req, res) {
    const passengerId = req.params.passengerId;

    const {
        passType,
        amountPaid,
        numberOfValidZones,
        timedPassType
    } = req.body;

    const result = await passService.purchasePassForPassenger(
        passengerId,
        passType,
        amountPaid,
        numberOfValidZones,
        timedPassType
    );

    if (!result.success) {
        return res.status(400).json({
            success: false
        });
    }

    return res.status(201).json(result);
}


async function topUpTimedPass(req, res) {
    const ticketId = req.params.ticketId;

    const {
        amountPaid,
        passType
    } = req.body;

    const result = await passService.topUpTimedPass(
        ticketId,
        amountPaid,
        passType
    );

    if (!result.success) {
        return res.status(400).json({
            success: false
        });
    }

    return res.json(result);
}


async function getPassengerPasses(req, res) {
    const passengerId = req.params.passengerId;

    const passes = await passService.getPassesByPassengerId(
        passengerId
    );

    return res.json(passes);
}


module.exports = {
    purchasePass,
    topUpTimedPass,
    getPassengerPasses,
};