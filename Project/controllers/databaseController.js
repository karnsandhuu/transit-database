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