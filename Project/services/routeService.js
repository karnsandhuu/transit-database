const { withOracleDB } = require('../db/oracle');

async function insertRoute(
    routeNumber,
    routeName,
    routeDescription = null,
    colour = null
) {
    return await withOracleDB(async (connection) => {
        try {
            const routeId = await generateRouteID(connection);

            const result = await connection.execute(
                `
                INSERT INTO Route
                (
                    RouteID,
                    RouteNumber,
                    RouteName,
                    RouteDescription,
                    Colour
                )
                VALUES
                (
                    :routeId,
                    :routeNumber,
                    :routeName,
                    :routeDescription,
                    :colour
                )
                `,
                {
                    routeId,
                    routeNumber,
                    routeName,
                    routeDescription,
                    colour
                },
                {
                    autoCommit: true
                }
            );

            if (result.rowsAffected > 0) {
                return {
                    success: true,
                    routeId
                };
            }

            return {
                success: false
            };

        } catch (err) {
            console.log("Error inserting route:", err.message);

            return {
                success: false
            };
        }
    });
}

async function generateRouteID(connection) {
    const result = await connection.execute(`
        SELECT MAX(RouteID)
        FROM Route
    `);

    const maxID = result.rows[0][0];

    if (!maxID) {
        return "R000000001";
    }

    const number = parseInt(maxID.substring(1)) + 1;

    return "R" + String(number).padStart(9, "0");
}

async function getRouteById(routeId) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    RouteID,
                    RouteNumber,
                    RouteName,
                    RouteDescription,
                    Colour
                FROM Route
                WHERE RouteID = :routeId
                `,
                {
                    routeId
                }
            );

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];

            return {
                routeId: row[0],
                routeNumber: row[1],
                routeName: row[2],
                routeDescription: row[3],
                colour: row[4]
            };

        } catch (err) {
            console.log("Error retrieving route:", err.message);

            return null;
        }
    });
}


async function getRouteByNumber(routeNumber) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    RouteID,
                    RouteNumber,
                    RouteName,
                    RouteDescription,
                    Colour
                FROM Route
                WHERE RouteNumber = :routeNumber
                `,
                {
                    routeNumber
                }
            );

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];

            return {
                routeId: row[0],
                routeNumber: row[1],
                routeName: row[2],
                routeDescription: row[3],
                colour: row[4]
            };

        } catch (err) {
            console.log("Error retrieving route:", err.message);

            return null;
        }
    });
}

async function insertSchedule(
    routeId,
    startTime,
    dayType,
    endTime,
    frequency
) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                INSERT INTO Schedule
                (
                    RouteID,
                    StartTime,
                    DayType,
                    EndTime,
                    Frequency
                )
                VALUES
                (
                    :routeId,
                    :startTime,
                    :dayType,
                    :endTime,
                    :frequency
                )
                `,
                {
                    routeId,
                    startTime,
                    dayType,
                    endTime,
                    frequency
                },
                {
                    autoCommit: true
                }
            );

            if (result.rowsAffected > 0) {
                return {
                    success: true,
                    routeId
                };
            }

            return {
                success: false
            };

        } catch (err) {
            console.log("Error inserting schedule:", err.message);

            return {
                success: false
            };
        }
    });
}

async function getSchedulesByRouteNumber(routeNumber) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    r.RouteNumber,
                    s.StartTime,
                    s.DayType,
                    s.EndTime,
                    s.Frequency
                FROM Schedule s
                JOIN Route r
                    ON s.RouteID = r.RouteID
                WHERE r.RouteNumber = :routeNumber
                ORDER BY
                    s.DayType,
                    s.StartTime
                `,
                {
                    routeNumber
                }
            );

            return result.rows.map(row => ({
                routeNumber: row[0],
                startTime: row[1],
                dayType: row[2],
                endTime: row[3],
                frequency: row[4]
            }));

        } catch (err) {
            console.log(
                "Error retrieving schedules by route number:",
                err.message
            );

            return [];
        }
    });
}

async function insertRouteStop(
    routeId,
    stopNumber,
    stationId
) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                INSERT INTO RouteStop
                (
                    RouteID,
                    StopNumber,
                    StationID
                )
                VALUES
                (
                    :routeId,
                    :stopNumber,
                    :stationId
                )
                `,
                {
                    routeId,
                    stopNumber,
                    stationId
                },
                {
                    autoCommit: true
                }
            );

            if (result.rowsAffected > 0) {
                return {
                    success: true,
                    routeId,
                    stopNumber,
                    stationId
                };
            }

            return {
                success: false
            };

        } catch (err) {
            console.log(
                "Error inserting route stop:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}

async function getRouteStopsByRouteNumber(routeNumber) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    rs.StationID,
                    s.StationName,
                    s.Address,
                    s.ZoneNumber,
                    s.WheelchairAccessibility
                FROM RouteStop rs
                JOIN Route r
                    ON rs.RouteID = r.RouteID
                JOIN TransportStation s
                    ON rs.StationID = s.StationID
                WHERE r.RouteNumber = :routeNumber
                ORDER BY rs.StopNumber
                `,
                {
                    routeNumber
                }
            );

            return result.rows.map((row, index) => ({
                stopNumber: index + 1,
                stationId: row[0],
                stationName: row[1],
                address: row[2],
                zoneNumber: row[3],
                wheelchairAccessibility: row[4]
            }));

        } catch (err) {
            console.log(
                "Error retrieving route stops:",
                err.message
            );

            return [];
        }
    });
}


module.exports = {
    insertRoute,
    insertSchedule,
    insertRouteStop,
    getRouteById,
    getRouteByNumber,
    getSchedulesByRouteNumber,
    getRouteStopsByRouteNumber
};

