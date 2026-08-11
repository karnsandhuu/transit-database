const appService = require('../services/databaseService');

async function checkConnection(req, res) {

    const result =
        await appService.testOracleConnection();

    if (result) {
        res.send("connected");
    }
    else {
        res.send("unable to connect");
    }
}

async function clearDatabase(req, res) {
    const initiateResult = await appService.resetDatabase();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
}

async function rePopulateDatabase(req, res) {
    const initiateResult = await appService.rePopulateDatabase();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
}


module.exports = {
    checkConnection,
    clearDatabase,
    rePopulateDatabase
};