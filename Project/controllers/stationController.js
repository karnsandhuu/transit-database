const stationService = require('../services/stationService');


// Get all zones
async function getAllZones(req, res) {
    try {
        const result = await stationService.getAllZones();

        return res.json(result);

    } catch (err) {
        console.error('Error retrieving zones:', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


// Get all stations
async function getAllStations(req, res) {
    try {
        const result = await stationService.getAllStations();

        return res.json(result);

    } catch (err) {
        console.error('Error retrieving stations:', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


// Get all stations in a specific zone
async function getStationsByZone(req, res) {
    try {
        const zoneNumber = Number(req.params.zoneNumber);

        const result = await stationService.getStationsByZone(
            zoneNumber
        );

        return res.json(result);

    } catch (err) {
        console.error(
            'Error retrieving stations by zone:',
            err
        );

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


module.exports = {
    getAllZones,
    getAllStations,
    getStationsByZone
};