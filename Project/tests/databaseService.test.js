const databaseService = require('../services/databaseService');
const { withOracleDB } = require('../db/oracle');

async function checkTables() {
    return await withOracleDB(async (connection) => {

        const result = await connection.execute(`
            SELECT table_name
            FROM user_tables
            ORDER BY table_name
        `);

        console.log(result.rows);

    });
}

module.exports = async function () {

    console.log("Initializing database...");
    //await databaseService.initializeDatabase();
    await databaseService.resetDatabase();
    await checkTables();

};