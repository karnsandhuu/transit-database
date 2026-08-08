const trainService = require('../services/trainService');

async function getSubwayTrainByTrainSetNumber(req, res) {
    const trainSetNumber = req.params.trainSetNumber;

    const result =
        await trainService.getSubwayTrainByTrainSetNumber(
            trainSetNumber
        );

    if (!result) {
        return res.status(404).json({
            success: false
        });
    }

    return res.json(result);

}

module.exports = {
    getSubwayTrainByTrainSetNumber
};