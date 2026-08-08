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
    const { attributes } = req.body;

    try {
        const passenger =
            await passengerService.getPassengerById(
                passengerId,
                attributes
            );

        if (!passenger) {
            return res.status(404).json({
                message: "Passenger not found"
            });
        }

        return res.json(passenger);

    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
}

async function updatePassengerCategory(req, res) {
    const { passengerId } = req.params;
    const { passengerCategory } = req.body;

    const success = await passengerService.updatePassengerCategory(
        passengerId,
        passengerCategory
    );

    if (success) {
        res.json({
            success: true
        });
    } else {
        res.status(404).json({
            success: false,
            message: "Passenger not found or unable to update category"
        });
    }
}

module.exports = {
    createPassenger,
    getPassenger,
    updatePassengerCategory
};

