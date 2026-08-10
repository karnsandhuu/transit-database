const { withOracleDB } = require('../db/oracle');


async function getAverageSpendingByPassengerCategory() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT
                p.PassengerCategory,
                COUNT(DISTINCT p.PassengerID) AS PassengerCount,
                AVG(pa.AmountPaid) AS AverageAmountSpent
            FROM Passenger p
            JOIN Passes pa
                ON p.PassengerID = pa.PassengerID
            GROUP BY
                p.PassengerCategory
            ORDER BY
                p.PassengerCategory
        `);

        return result.rows.map(row => ({
            passengerCategory: row[0],
            passengerCount: row[1],
            averageAmountSpent: row[2]
        }));
    }).catch(err => {
        console.log(
            "Error retrieving average spending by passenger category:",
            err.message
        );

        return [];
    });
}

async function getGatesWithMoreThan100Events() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    GateID,
                    StationID,
                    EnterOrExit,
                    TotalEnterExitCount
                FROM Gate
                GROUP BY
                    GateID,
                    StationID,
                    EnterOrExit,
                    TotalEnterExitCount
                HAVING
                    TotalEnterExitCount > 100
                ORDER BY
                    TotalEnterExitCount DESC
                `
            );

            return result.rows.map(row => ({
                gateId: row[0],
                stationId: row[1],
                enterOrExit: row[2],
                totalEnterExitCount: row[3]
            }));

        } catch (err) {
            console.log(
                "Error retrieving gates with more than 100 events:",
                err.message
            );

            return [];
        }
    });
}


// Nested Aggregation with GROUP BY
// Finds stations that are served by more than the average number of routes

async function getStationsServedByMoreThanAverageRoutes() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    s.StationID,
                    s.StationName,
                    COUNT(DISTINCT rs.RouteID) AS RouteCount
                FROM TransportStation s
                LEFT JOIN RouteStop rs
                    ON s.StationID = rs.StationID
                GROUP BY
                    s.StationID,
                    s.StationName
                HAVING COUNT(DISTINCT rs.RouteID) >= (
                    SELECT AVG(route_count)
                    FROM (
                        SELECT
                            s2.StationID,
                            COUNT(DISTINCT rs2.RouteID) AS route_count
                        FROM TransportStation s2
                        LEFT JOIN RouteStop rs2
                            ON s2.StationID = rs2.StationID
                        GROUP BY s2.StationID
                    )
                )
                ORDER BY
                    RouteCount DESC
                `
            );

            return result.rows.map(row => ({
                stationId: row[0],
                stationName: row[1],
                routeCount: row[2]
            }));

        } catch (err) {
            console.log(
                "Error retrieving stations served by more than average routes:",
                err.message
            );

            return [];
        }
    });
}

async function getPassengersWithAllPassTypesCount() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT COUNT(*) AS PassengerCount
                FROM Passenger p
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM (
                        SELECT 'Zone' AS PassType
                        FROM dual

                        UNION

                        SELECT 'Timed' AS PassType
                        FROM dual
                    ) requiredTypes
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM Passes pa
                        LEFT JOIN ZonePass zp
                            ON pa.TicketID = zp.TicketID
                        LEFT JOIN TimedPass tp
                            ON pa.TicketID = tp.TicketID
                        WHERE pa.PassengerID = p.PassengerID
                        AND (
                            (
                                requiredTypes.PassType = 'Zone'
                                AND zp.TicketID IS NOT NULL
                            )
                            OR
                            (
                                requiredTypes.PassType = 'Timed'
                                AND tp.TicketID IS NOT NULL
                            )
                        )
                    )
                )
                `
            );

            return result.rows[0][0];

        } catch (err) {
            console.log(
                "Error counting passengers with all pass types:",
                err.message
            );

            return 0;
        }
    });
}

module.exports = {
    getAverageSpendingByPassengerCategory,
    getGatesWithMoreThan100Events,
    getStationsServedByMoreThanAverageRoutes,
    getPassengersWithAllPassTypesCount
};