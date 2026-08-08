
const { withOracleDB } = require('../db/oracle');


async function purchasePassForPassenger(
    passengerId,
    passType,
    amountPaid,
    numberOfValidZones = null,
    timedPassType = null
) {
    if (passType === "Zone") {
        if (!numberOfValidZones) {
            return { success: false };
        }

        return await purchaseZonePass(
            passengerId,
            amountPaid,
            numberOfValidZones
        );
    }

    if (passType === "Timed") {
        if (!timedPassType) {
            return { success: false };
        }

        return await purchaseTimedPass(
            passengerId,
            amountPaid,
            timedPassType
        );
    }
    return {
        success: false
    };
}


async function insertPass(
    connection,
    passengerId,
    amountPaid
) {
    await updatePassesSystem();
    const ticketId = await generateTicketID(connection);

    await connection.execute(
        `
        INSERT INTO Passes
        (
            TicketID,
            PassengerID,
            AmountPaid,
            TravellingStatus
        )
        VALUES
        (
            :ticketId,
            :passengerId,
            :amountPaid,
            'Active'
        )
        `,
        {
            ticketId,
            passengerId,
            amountPaid
        }
    );

    return ticketId;
}

async function generateTicketID(connection) {
    const result = await connection.execute(`
        SELECT MIN(ticketNumber)
        FROM (
            SELECT LEVEL AS ticketNumber
            FROM dual
            CONNECT BY LEVEL <= (
                SELECT NVL(
                    MAX(TO_NUMBER(SUBSTR(TicketID, 2))),
                    0
                ) + 1
                FROM Passes
            )
        )
        WHERE ticketNumber NOT IN (
            SELECT TO_NUMBER(SUBSTR(TicketID, 2))
            FROM Passes
        )
    `);
    const nextNumber = result.rows[0][0];

    return "T" + String(nextNumber).padStart(9, "0");
}

async function updatePassAmount(ticketId, amountPaid) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            UPDATE Passes
            SET AmountPaid = :amountPaid
            WHERE TicketID = :ticketId
            `,
            {
                amountPaid,
                ticketId
            },
            {
                autoCommit: true
            }
        );

        return result.rowsAffected > 0;

    }).catch((err) => {
        console.log("Error updating pass amount:", err.message);
        return false;
    });
}

async function purchaseZonePass(passengerId, amountPaid, numberOfValidZones) {

    return await withOracleDB(async (connection) => {
        try {
            const ticketId = await insertPass(connection, passengerId, amountPaid);
            await connection.execute(
                `
                INSERT INTO ZonePass
                (
                    TicketID,
                    NumberOfValidZones
                )
                VALUES
                (
                    :ticketId,
                    :numberOfValidZones
                )
                `,
                {
                    ticketId,
                    numberOfValidZones
                }
            );
            await connection.commit();
            return {
                success: true,
                ticketId
            };

        } catch (err) {
            await connection.rollback();

            console.log(
                "Error purchasing zone pass:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}

async function purchaseTimedPass(
    passengerId,
    amountPaid,
    passType
) {
    return await withOracleDB(async (connection) => {
        try {
            const ticketId = await insertPass(
                connection,
                passengerId,
                amountPaid
            );

            await connection.execute(
                `
                INSERT INTO TimedPass
                (
                    TicketID,
                    StartTime,
                    EndTime,
                    PassType
                )
                VALUES
                (
                    :ticketId,
                    CURRENT_TIMESTAMP,
                    CASE
                        WHEN :passType = 'Daily'
                            THEN CURRENT_TIMESTAMP + INTERVAL '1' DAY
                        WHEN :passType = 'Weekly'
                            THEN CURRENT_TIMESTAMP + INTERVAL '7' DAY
                        WHEN :passType = 'Monthly'
                            THEN CURRENT_TIMESTAMP + INTERVAL '1' MONTH
                    END,
                    :passType
                )
                `,
                {
                    ticketId,
                    passType
                }
            );

            await connection.commit();

            return {
                success: true,
                ticketId
            };

        } catch (err) {
            await connection.rollback();

            console.log(
                "Error purchasing timed pass:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}

async function topUpTimedPass(ticketId, amountPaid, passType) {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(
                `
                UPDATE TimedPass
                SET
                    EndTime =
                        CASE
                            WHEN :passType = 'Daily'
                                THEN EndTime + INTERVAL '1' DAY
                            WHEN :passType = 'Weekly'
                                THEN EndTime + INTERVAL '7' DAY
                            WHEN :passType = 'Monthly'
                                THEN EndTime + INTERVAL '1' MONTH
                        END,
                    PassType = :passType
                WHERE TicketID = :ticketId
                `,
                {
                    passType,
                    ticketId
                }
            );
            // Add the top-up payment to the existing amount
            await connection.execute(
                `
                UPDATE Passes
                SET
                    AmountPaid = AmountPaid + :amountPaid,
                    TravellingStatus = 'Active'
                WHERE TicketID = :ticketId
                `,
                {
                    amountPaid,
                    ticketId
                }
            );

            await connection.commit();

            return {
                success: true,
                ticketId
            };

        } catch (err) {
            await connection.rollback();

            console.log(
                "Error topping up timed pass:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}

async function getAllPasses() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT
                p.TicketID,
                p.PassengerID,
                p.AmountPaid,
                p.TravellingStatus,
                p.PurchaseTime,

                CASE
                    WHEN z.TicketID IS NOT NULL THEN 'Zone'
                    WHEN t.TicketID IS NOT NULL THEN 'Timed'
                END AS PassType,

                t.PassType AS TimedPassType

            FROM Passes p

            LEFT JOIN ZonePass z
                ON p.TicketID = z.TicketID

            LEFT JOIN TimedPass t
                ON p.TicketID = t.TicketID

            ORDER BY p.PurchaseTime DESC
            `
        );

        return result.rows.map(row => ({
            ticketId: row[0],
            passengerId: row[1],
            amountPaid: row[2],
            travellingStatus: row[3],
            purchaseTime: row[4],
            passType: row[5],
            timedPassType: row[6]
        }));

    }).catch((err) => {
        console.log("Error retrieving passes:", err.message);
        return [];
    });
}

async function updatePassesSystem() {
    const zoneResult = await deleteInactiveZonePasses();

    if (!zoneResult.success) {
        return {
            success: false
        };
    }

    const timedResult = await updateExpiredTimedPasses();

    if (!timedResult.success) {
        return {
            success: false
        };
    }

    return {
        success: true,
        deletedZonePasses: zoneResult.deletedCount,
        expiredTimedPasses: timedResult.updatedCount
    };
}

async function deleteInactiveZonePasses() {
    return await withOracleDB(async (connection) => {
        try {
            // Delete the ZonePass rows whose corresponding
            // Passes row is inactive.
            await connection.execute(
                `
                DELETE FROM ZonePass
                WHERE TicketID IN (
                    SELECT TicketID
                    FROM Passes
                    WHERE TravellingStatus = 'Inactive'
                )
                `
            );

            // Delete the corresponding Passes rows.
            const result = await connection.execute(
                `
                DELETE FROM Passes
                WHERE TravellingStatus = 'Inactive'
                AND TicketID NOT IN (
                    SELECT TicketID
                    FROM TimedPass
                )
                `
            );

            await connection.commit();

            return {
                success: true,
                deletedCount: result.rowsAffected
            };

        } catch (err) {
            await connection.rollback();

            console.log(
                "Error deleting inactive zone passes:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}

async function updateExpiredTimedPasses() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                UPDATE Passes
                SET TravellingStatus = 'Inactive'
                WHERE TicketID IN (
                    SELECT TicketID
                    FROM TimedPass
                    WHERE EndTime <= CURRENT_TIMESTAMP
                )
                AND TravellingStatus = 'Active'
                `,
                {},
                {
                    autoCommit: true
                }
            );

            return {
                success: true,
                updatedCount: result.rowsAffected
            };

        } catch (err) {
            console.log(
                "Error updating expired timed passes:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}

async function getPassesByPassengerId(passengerId) {
    await updatePassesSystem();
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT
                p.TicketID,
                p.AmountPaid,
                p.TravellingStatus,
                p.PurchaseTime,

                CASE
                    WHEN z.TicketID IS NOT NULL THEN 'Zone'
                    WHEN t.TicketID IS NOT NULL THEN 'Timed'
                END AS PassType,

                z.NumberOfValidZones,
                t.StartTime,
                t.EndTime,
                t.PassType AS TimedPassType

            FROM Passes p

            LEFT JOIN ZonePass z
                ON p.TicketID = z.TicketID

            LEFT JOIN TimedPass t
                ON p.TicketID = t.TicketID

            WHERE p.PassengerID = :passengerId

            ORDER BY p.PurchaseTime DESC
            `,
            { passengerId }
        );

        return result.rows.map(row => ({
            ticketId: row[0],
            amountPaid: row[1],
            travellingStatus: row[2],
            purchaseTime: row[3],
            passType: row[4],
            numberOfValidZones: row[5],
            startTime: row[6],
            endTime: row[7],
            timedPassType: row[8]
        }));

    }).catch((err) => {
        console.log(
            "Error retrieving passenger passes:",
            err.message
        );

        return [];
    });
}

async function deletePass(passengerId, ticketId) {
    return await withOracleDB(async (connection) => {
        try {
            // Check that the pass belongs to the passenger
            const passResult = await connection.execute(
                `SELECT TicketID
                 FROM Passes
                 WHERE TicketID = :ticketId
                 AND PassengerID = :passengerId`,
                {
                    ticketId,
                    passengerId
                }
            );

            if (passResult.rows.length === 0) {
                return { success: false };
            }

            // Delete from ZonePass if it exists
            await connection.execute(
                `DELETE FROM ZonePass
                 WHERE TicketID = :ticketId`,
                { ticketId }
            );

            // Delete from TimedPass if it exists
            await connection.execute(
                `DELETE FROM TimedPass
                 WHERE TicketID = :ticketId`,
                { ticketId }
            );

            // Delete the parent Passes record
            const result = await connection.execute(
                `DELETE FROM Passes
                 WHERE TicketID = :ticketId
                 AND PassengerID = :passengerId`,
                {
                    ticketId,
                    passengerId
                }
            );

            await connection.commit();

            return {
                success: result.rowsAffected > 0
            };

        } catch (err) {
            await connection.rollback();
            throw err;
        }
    }).catch((err) => {
        console.log('Error deleting pass:', err.message);
        return {
            success: false
        };
    });
}

module.exports = {
    purchasePassForPassenger,
    getPassesByPassengerId,
    getAllPasses,
    topUpTimedPass,
    deletePass
};