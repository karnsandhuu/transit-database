// Database service for initializing the transport database 
const fs = require('fs');
const path = require('path');
const { withOracleDB } = require('../db/oracle');

const tables = [
    "PassExit",
    "PassEnter",
    "RunsOn",
    "Gate",
    "RouteStop",
    "TransportStation",
    "Schedule",
    "Route",
    "TimedPass",
    "ZonePass",
    "Passes",
    "Passenger",
    "SubwayTrain",
    "TrainModel",
    "Zone"
];

//Returns true upon successful initialization, else throws an error
async function initializeDatabase() {
    const schemaPath = path.join(__dirname, '../db/transportSchema.sql');

    const sql = fs.readFileSync(
        schemaPath,
        'utf8'
    );

    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    return await withOracleDB(async (connection) => {
        for (const statement of statements) {
            try {
                await connection.execute(statement);
            } catch (err) {
                console.error("${err.message}: Failed statement:");
                console.error(statement);
                throw err;
            }
            
        }
        return true;
    });
}

async function clearDatabase() {
    await withOracleDB(async (connection) => {
        for (const table of tables) {

            try {

                await connection.execute(
                    `DROP TABLE ${table} CASCADE CONSTRAINTS`
                );

                //console.log(`Dropped ${table}`);

            } catch (err) {

                // Table may not exist
                console.log(`Skipping ${table} because: ${err.message}`);

            }
        }
    });
}

async function resetDatabase() {
    await clearDatabase();
    await initializeDatabase();

}

async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    initializeDatabase,
    resetDatabase,
    testOracleConnection
};