const passengerService = require('../services/passengerService');
async function createPassenger(req, res) {
    const { firstName, lastName, passengerType } = req.body;
    const result = await passengerService.insertPassenger(firstName, lastName, passengerType);
    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(400).json({
            success: false,
            message: "Unable to create passenger"
        });
    }
}

async function getPassenger(req, res) {
    const { passengerId } = req.params;

    const passenger = await passengerService.getPassengerById(
        passengerId
    );

    if (passenger) {
        res.json(passenger);
    } else {
        res.status(404).json({
            message: "Passenger not found"
        });
    }
}

async function updatePassengerType(req, res) {
    const { passengerId } = req.params;
    const { passengerType } = req.body;

    const success = await passengerService.updatePassengerType(
        passengerId,
        passengerType
    );

    if (success) {
        res.json({
            success: true
        });
    } else {
        res.status(404).json({
            success: false,
            message: "Passenger not found or unable to update type"
        });
    }
}

module.exports = {
    createPassenger,
    getPassenger,
    updatePassengerType
};

