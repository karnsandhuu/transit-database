const { initializeConnectionPool, closePoolAndExit } = require('../db/oracle');

// Before running: paste export DYLD_LIBRARY_PATH=/Users/carina/Documents/CPSC_304/instantclient_19_8:$DYLD_LIBRARY_PATH   
// into terminal
async function run() {

    await initializeConnectionPool();

    //await require('./demotableService.test')();
    //await require('./databaseService.test')();
    //await require('./passengerService.test')();
    //await require('./passService.test')();
    //await require('./gateService.test')();
    await require('./routeServices.test')();
    await closePoolAndExit();

}

run();