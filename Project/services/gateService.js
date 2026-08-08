const { withOracleDB } = require('../db/oracle');
async function insertGate(
    stationId,
    activationStatus = "Active",
    enterOrExit
) {
    return await withOracleDB(async (connection) => {
        try {
            const gateId = await generateGateID(connection);

            const result = await connection.execute(
                `
                INSERT INTO Gate
                (
                    GateID,
                    StationID,
                    ActivationStatus,
                    EnterOrExit
                )
                VALUES
                (
                    :gateId,
                    :stationId,
                    :activationStatus,
                    :enterOrExit
                )
                `,
                {
                    gateId,
                    stationId,
                    activationStatus,
                    enterOrExit
                },
                {
                    autoCommit: true
                }
            );

            if (result.rowsAffected > 0) {
                return {
                    success: true,
                    gateId
                };
            }

            return {
                success: false
            };

        } catch (err) {
            console.log("Error inserting gate:", err.message);

            return {
                success: false
            };
        }
    });
}

async function generateGateID(connection) {
    const result = await connection.execute(`
        SELECT MAX(GateID)
        FROM Gate
    `);

    const maxID = result.rows[0][0];

    if (!maxID) {
        return "G000000001";
    }

    const number = parseInt(maxID.substring(1)) + 1;

    return "G" + String(number).padStart(9, "0");
}


async function getGateById(gateId) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    GateID,
                    StationID,
                    ActivationStatus,
                    EnterOrExit,
                    TotalEnterExitCount
                FROM Gate
                WHERE GateID = :gateId
                `,
                {
                    gateId
                }
            );

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];

            return {
                gateId: row[0],
                stationId: row[1],
                activationStatus: row[2],
                enterOrExit: row[3],
                totalEnterExitCount: row[4]
            };

        } catch (err) {
            console.log("Error retrieving gate:", err.message);
            return null;
        }
    });
}

async function getGatesByStation(stationId) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    GateID,
                    StationID,
                    ActivationStatus,
                    EnterOrExit,
                    TotalEnterExitCount
                FROM Gate
                WHERE StationID = :stationId
                ORDER BY GateID
                `,
                {
                    stationId
                }
            );

            return result.rows.map(row => ({
                gateId: row[0],
                stationId: row[1],
                activationStatus: row[2],
                enterOrExit: row[3],
                totalEnterExitCount: row[4]
            }));

        } catch (err) {
            console.log(
                "Error retrieving gates by station:",
                err.message
            );

            return [];
        }
    });
}

async function updateGate(
    gateId,
    activationStatus = null,
    enterOrExit = null
) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                UPDATE Gate
                SET
                    ActivationStatus = COALESCE(
                        :activationStatus,
                        ActivationStatus
                    ),
                    EnterOrExit = COALESCE(
                        :enterOrExit,
                        EnterOrExit
                    )
                WHERE GateID = :gateId
                `,
                {
                    gateId,
                    activationStatus,
                    enterOrExit
                },
                {
                    autoCommit: true
                }
            );

            return result.rowsAffected > 0;

        } catch (err) {
            console.log(
                "Error updating gate:",
                err.message
            );

            return false;
        }
    });
}

async function enterGate(ticketId, gateId) {
    return await withOracleDB(async (connection) => {
        try {
            // Check the pass and gate
            const result = await connection.execute(
                `
                SELECT
                    p.TravellingStatus,
                    g.ActivationStatus,
                    g.EnterOrExit
                FROM Passes p
                JOIN Gate g
                    ON g.GateID = :gateId
                WHERE p.TicketID = :ticketId
                `,
                {
                    ticketId,
                    gateId
                }
            );

            // Pass or gate does not exist
            if (result.rows.length === 0) {
                return {
                    success: false
                };
            }

            const travellingStatus = result.rows[0][0];
            const activationStatus = result.rows[0][1];
            const enterOrExit = result.rows[0][2];

            // Pass must be active
            if (travellingStatus !== "Active") {
                return {
                    success: false
                };
            }

            // Gate must be active
            if (activationStatus !== "Active") {
                return {
                    success: false
                };
            }

            // Gate must allow entry
            if (enterOrExit !== "Enter") {
                return {
                    success: false
                };
            }

            // Record the successful entry
            await connection.execute(
                `
                INSERT INTO PassEnter
                (
                    TicketID,
                    GateID
                )
                VALUES
                (
                    :ticketId,
                    :gateId
                )
                `,
                {
                    ticketId,
                    gateId
                }
            );

            // Update gate usage count
            await connection.execute(
                `
                UPDATE Gate
                SET TotalEnterExitCount =
                    TotalEnterExitCount + 1
                WHERE GateID = :gateId
                `,
                {
                    gateId
                }
            );

            await connection.commit();

            return {
                success: true
            };

        } catch (err) {
            await connection.rollback();

            console.log(
                "Error entering gate:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}

async function exitGate(ticketId, gateId) {
    return await withOracleDB(async (connection) => {
        try {
            const gate = await getExitGateInfo(
                connection,
                gateId
            );

            if (!gate) {
                return { success: false };
            }

            if (
                gate.activationStatus !== "Active" ||
                gate.enterOrExit !== "Exit"
            ) {
                return { success: false };
            }

            const entry = await getLatestEntry(
                connection,
                ticketId
            );

            if (!entry) {
                return { success: false };
            }

            const pass = await getPassInfo(
                connection,
                ticketId
            );

            if (!pass) {
                return { success: false };
            }

            if (pass.passType === "Zone") {
                const valid = validateZonePassExit(
                    entry.zoneNumber,
                    gate.zoneNumber,
                    pass.numberOfValidZones
                );

                if (!valid) {
                    return { success: false };
                }
            } else if (pass.passType !== "Timed") {
                return { success: false };
            }

            await recordExit(
                connection,
                ticketId,
                gateId
            );

            await connection.commit();

            return {
                success: true
            };

        } catch (err) {
            await connection.rollback();

            console.log(
                "Error exiting gate:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}

async function getExitGateInfo(connection, gateId) {
    const result = await connection.execute(
        `
        SELECT
            g.ActivationStatus,
            g.EnterOrExit,
            s.ZoneNumber
        FROM Gate g
        JOIN TransportStation s
            ON g.StationID = s.StationID
        WHERE g.GateID = :gateId
        `,
        { gateId }
    );

    if (result.rows.length === 0) {
        return null;
    }

    return {
        activationStatus: result.rows[0][0],
        enterOrExit: result.rows[0][1],
        zoneNumber: result.rows[0][2]
    };
}

async function getLatestEntry(connection, ticketId) {
    const result = await connection.execute(
        `
        SELECT
            pe.EntryTime,
            s.ZoneNumber
        FROM PassEnter pe
        JOIN Gate g
            ON pe.GateID = g.GateID
        JOIN TransportStation s
            ON g.StationID = s.StationID
        WHERE pe.TicketID = :ticketId
        AND pe.EntryTime > (
            SELECT NVL(
                MAX(ExitTime),
                TIMESTAMP '1900-01-01 00:00:00'
            )
            FROM PassExit
            WHERE TicketID = :ticketId
        )
        ORDER BY pe.EntryTime DESC
        FETCH FIRST 1 ROW ONLY
        `,
        { ticketId }
    );

    if (result.rows.length === 0) {
        return null;
    }

    return {
        entryTime: result.rows[0][0],
        zoneNumber: result.rows[0][1]
    };
}

async function getPassInfo(connection, ticketId) {
    const result = await connection.execute(
        `
        SELECT
            CASE
                WHEN z.TicketID IS NOT NULL THEN 'Zone'
                WHEN t.TicketID IS NOT NULL THEN 'Timed'
            END AS PassType,
            z.NumberOfValidZones
        FROM Passes p
        LEFT JOIN ZonePass z
            ON p.TicketID = z.TicketID
        LEFT JOIN TimedPass t
            ON p.TicketID = t.TicketID
        WHERE p.TicketID = :ticketId
        `,
        { ticketId }
    );

    if (result.rows.length === 0) {
        return null;
    }

    return {
        passType: result.rows[0][0],
        numberOfValidZones: result.rows[0][1]
    };
}

function validateZonePassExit(
    entryZone,
    exitZone,
    numberOfValidZones
) {
    const zoneDistance = Math.abs(
        entryZone - exitZone
    );

    return zoneDistance <= numberOfValidZones;
}

async function recordExit(connection, ticketId, gateId) {
    await connection.execute(
        `
        INSERT INTO PassExit
    (
        TicketID,
        GateID
    )
VALUES
    (
            : ticketId,
            : gateId
    )
    `,
        {
            ticketId,
            gateId
        }
    );

    // Increment the gate's total entrance/exit count
    await connection.execute(
        `
        UPDATE Gate
        SET TotalEnterExitCount =
    TotalEnterExitCount + 1
        WHERE GateID = : gateId
    `,
        {
            gateId
        }
    );

    // Zone passes become inactive after exiting.
    // Timed passes remain active until they expire.
    await connection.execute(
        `
        UPDATE Passes
        SET TravellingStatus = 'Inactive'
        WHERE TicketID = : ticketId
        AND TicketID IN(
        SELECT TicketID
            FROM ZonePass
    )
    `,
        {
            ticketId
        }
    );
}



module.exports = {
    insertGate,
    getGateById,
    getGatesByStation,
    updateGate,
    enterGate,
    exitGate
};