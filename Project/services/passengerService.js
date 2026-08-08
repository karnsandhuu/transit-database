
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

async function getPassengerById(
    passengerId,
    attributes = [
        'passengerId',
        'firstName',
        'lastName',
        'passengerCategory'
    ]
) {
    const allowedAttributes = {
        passengerId: 'PassengerID',
        firstName: 'FirstName',
        lastName: 'LastName',
        passengerCategory: 'PassengerCategory'
    };

    // Make sure at least one attribute was selected
    if (!Array.isArray(attributes) || attributes.length === 0) {
        return null;
    }

    // Make sure every requested attribute is valid
    const columns = attributes.map(attribute => {
        if (!allowedAttributes[attribute]) {
            throw new Error(
                `Invalid passenger attribute: ${attribute}`
            );
        }

        return allowedAttributes[attribute];
    });

    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT ${columns.join(', ')}
                FROM Passenger
                WHERE PassengerID = :passengerId
                `,
                {
                    passengerId
                }
            );

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];

            const passenger = {};

            attributes.forEach((attribute, index) => {
                passenger[attribute] = row[index];
            });

            return passenger;

        } catch (err) {
            console.log(
                'Error retrieving passenger:',
                err.message
            );

            return null;
        }
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
            passengerCategory: row[3]
        }));
    }).catch((err) => {
        console.log('Error retrieving passengers:', err.message);
        return [];
    });
}

async function updatePassengerCategory(passengerId, passengerCategory) {

    return await withOracleDB(async (connection) => {

        const result = await connection.execute(
            `
            UPDATE Passenger
            SET PassengerCategory = :passengerCategory
            WHERE PassengerID = :passengerId
            `,
            {
                passengerCategory,
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
    updatePassengerCategory
};

