const { withOracleDB } = require('../db/oracle');


// Zone Services
async function insertZone(
    zoneNumber,
    zoneName,
    colour = null,
    zoneDescription = null
) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                INSERT INTO Zone
                (
                    ZoneNumber,
                    ZoneName,
                    Colour,
                    ZoneDescription
                )
                VALUES
                (
                    :zoneNumber,
                    :zoneName,
                    :colour,
                    :zoneDescription
                )
                `,
                {
                    zoneNumber,
                    zoneName,
                    colour,
                    zoneDescription
                },
                {
                    autoCommit: true
                }
            );

            if (result.rowsAffected > 0) {
                return {
                    success: true,
                    zoneNumber
                };
            }

            return {
                success: false
            };

        } catch (err) {
            console.log("Error inserting zone:", err.message);

            return {
                success: false
            };
        }
    });
}


async function getZoneById(zoneNumber) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    ZoneNumber,
                    ZoneName,
                    Colour,
                    ZoneDescription
                FROM Zone
                WHERE ZoneNumber = :zoneNumber
                `,
                {
                    zoneNumber
                }
            );

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];

            return {
                zoneNumber: row[0],
                zoneName: row[1],
                colour: row[2],
                zoneDescription: row[3]
            };

        } catch (err) {
            console.log("Error retrieving zone:", err.message);
            return null;
        }
    });
}


async function getAllZones() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    ZoneNumber,
                    ZoneName,
                    Colour,
                    ZoneDescription
                FROM Zone
                ORDER BY ZoneNumber
                `
            );

            return result.rows.map(row => ({
                zoneNumber: row[0],
                zoneName: row[1],
                colour: row[2],
                zoneDescription: row[3]
            }));

        } catch (err) {
            console.log("Error retrieving zones:", err.message);
            return [];
        }
    });
}

// Station Services
async function insertStation(
    zoneNumber,
    stationName,
    address,
    wheelchairAccessibility
) {
    return await withOracleDB(async (connection) => {
        try {
            const stationId = await generateStationID(connection);
            const result = await connection.execute(
                `
                INSERT INTO TransportStation
                (
                    StationID,
                    ZoneNumber,
                    StationName,
                    Address,
                    WheelchairAccessibility
                )
                VALUES
                (
                    :stationId,
                    :zoneNumber,
                    :stationName,
                    :address,
                    :wheelchairAccessibility
                )
                `,
                {
                    stationId,
                    zoneNumber,
                    stationName,
                    address,
                    wheelchairAccessibility
                },
                {
                    autoCommit: true
                }
            );

            if (result.rowsAffected > 0) {
                return {
                    success: true,
                    stationId
                };
            }

            return {
                success: false
            };

        } catch (err) {
            console.log("Error inserting station:", err.message);

            return {
                success: false
            };
        }
    });
}

async function generateStationID(connection) {
    const result = await connection.execute(`
        SELECT MAX(StationID)
        FROM TransportStation
    `);

    const maxID = result.rows[0][0];

    if (!maxID) {
        return "S000000001";
    }

    const number = parseInt(maxID.substring(1)) + 1;

    return "S" + String(number).padStart(9, "0");
}

async function getStationById(stationId) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    StationID,
                    ZoneNumber,
                    StationName,
                    Address,
                    WheelchairAccessibility
                FROM TransportStation
                WHERE StationID = :stationId
                `,
                {
                    stationId
                }
            );

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];

            return {
                stationId: row[0],
                zoneNumber: row[1],
                stationName: row[2],
                address: row[3],
                wheelchairAccessibility: row[4]
            };

        } catch (err) {
            console.log("Error retrieving station:", err.message);
            return null;
        }
    });
}
async function getAllStations() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    StationID,
                    ZoneNumber,
                    StationName,
                    Address,
                    WheelchairAccessibility
                FROM TransportStation
                ORDER BY StationID
                `
            );

            return result.rows.map(row => ({
                stationId: row[0],
                zoneNumber: row[1],
                stationName: row[2],
                address: row[3],
                wheelchairAccessibility: row[4]
            }));

        } catch (err) {
            console.log("Error retrieving stations:", err.message);
            return [];
        }
    });
}

async function getStationsByZone(zoneNumber) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    StationID,
                    ZoneNumber,
                    StationName,
                    Address,
                    WheelchairAccessibility
                FROM TransportStation
                WHERE ZoneNumber = :zoneNumber
                ORDER BY StationID
                `,
                {
                    zoneNumber
                }
            );

            return result.rows.map(row => ({
                stationId: row[0],
                zoneNumber: row[1],
                stationName: row[2],
                address: row[3],
                wheelchairAccessibility: row[4]
            }));

        } catch (err) {
            console.log(
                "Error retrieving stations by zone:",
                err.message
            );

            return [];
        }
    });
}

module.exports = {
    insertZone,
    getZoneById,
    getAllZones,
    insertStation,
    getStationById,
    getAllStations,
    getStationsByZone
};