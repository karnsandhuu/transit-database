const appService = require('../services/demotableService');
const { runTest } = require('./testUtils');

async function testFetchDemotable() {
    const rows = await appService.fetchDemotableFromDb();
    console.log(rows);
}

module.exports = async function runAppServiceTests() { 
    await runTest(
        "fetch demotable",
        testFetchDemotable
    );
}