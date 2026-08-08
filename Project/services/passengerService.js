
const { withOracleDB } = require('../db/oracle');

// A passenger has a passenger ID, first name, last name, and passenger type (e.g., adult, child, senior). The passenger ID is unique for each passenger.
async function insertPassenger(firstName, lastName, passengerType = "Adult") {
    return await withOracleDB(async (connection) => {
        const passengerId = await generatePassengerID(connection);
        const result = await connection.execute(
            `INSERT INTO PASSENGER 
            (
                PassengerID,
                FirstName,
                LastName,
                PassengerCategory
            )
            VALUES
            (
                :passengerId,
                :firstName,
                :lastName,
                :passengerType
            )`,
            [passengerId, firstName, lastName, passengerType],
            { autoCommit: true }
        );
        if (result.rowsAffected && result.rowsAffected > 0) {
            return {
                success: true,
                passengerId
            };
        } else {
            return { success: false };
        }
    }).catch((err) => {
        console.log('Error inserting passenger:', err.message);
        return {
            success: false
        };
    });
}


async function generatePassengerID(connection) {
    const result = await connection.execute(`
        SELECT MAX(PassengerID)
        FROM Passenger
    `);

    const maxID = result.rows[0][0];

    if (!maxID) {
        return "P000000001";
    }

    const number = parseInt(maxID.substring(1)) + 1;

    return "P" + String(number).padStart(9, "0");
}

async function getPassengerById(passengerId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM PASSENGER WHERE PassengerID = :passengerId`,
            [passengerId]
        );
        if (result.rows.length > 0) {
            const row = result.rows[0];
            return {
                passengerId: row[0],
                firstName: row[1],
                lastName: row[2],
                passengerType: row[3]
            };
        } else {
            return null;
        }
    }).catch((err) => {
        console.log('Error retrieving passenger:', err.message);
        return null;
    });
}

async function getAllPassengers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
        `
        SELECT
            PassengerID,
            FirstName,
            LastName,
            PassengerCategory
            FROM Passenger
        `
        );
        return result.rows.map(row => ({
            passengerId: row[0],
            firstName: row[1],
            lastName: row[2],
            passengerType: row[3]
        }));
    }).catch((err) => {
        console.log('Error retrieving passengers:', err.message);
        return [];
    });
}

async function updatePassengerType(passengerId, passengerType) {

    return await withOracleDB(async (connection) => {

        const result = await connection.execute(
            `
            UPDATE Passenger
            SET PassengerCategory = :passengerType
            WHERE PassengerID = :passengerId
            `,
            {
                passengerType,
                passengerId
            },
            {
                autoCommit: true
            }
        );

        return result.rowsAffected > 0;

    }).catch((err) => {
        console.log("Error updating passenger type:", err.message);
        return false;
    });
}


module.exports = {
    insertPassenger,
    getPassengerById,
    getAllPassengers,
    updatePassengerType
};

