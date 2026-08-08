const { withOracleDB } = require('../db/oracle');


// Train Model Services

async function insertTrainModel(
    modelName,
    numberOfCars
) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                INSERT INTO TrainModel
                (
                    ModelName,
                    NumberOfCars
                )
                VALUES
                (
                    :modelName,
                    :numberOfCars
                )
                `,
                {
                    modelName,
                    numberOfCars
                },
                {
                    autoCommit: true
                }
            );

            if (result.rowsAffected > 0) {
                return {
                    success: true,
                    modelName
                };
            }

            return {
                success: false
            };

        } catch (err) {
            console.log(
                "Error inserting train model:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}


// Subway Train Services

async function insertSubwayTrain(
    trainSetNumber,
    modelName,
    manufactureYear,
    capacity,
    wheelchairAccessibility
) {
    return await withOracleDB(async (connection) => {
        try {
            const vehicleId = await generateVehicleID(
                connection
            );

            const result = await connection.execute(
                `
                INSERT INTO SubwayTrain
                (
                    VehicleID,
                    TrainSetNumber,
                    ModelName,
                    ManufactureYear,
                    Capacity,
                    WheelchairAccessibility
                )
                VALUES
                (
                    :vehicleId,
                    :trainSetNumber,
                    :modelName,
                    :manufactureYear,
                    :capacity,
                    :wheelchairAccessibility
                )
                `,
                {
                    vehicleId,
                    trainSetNumber,
                    modelName,
                    manufactureYear,
                    capacity,
                    wheelchairAccessibility
                },
                {
                    autoCommit: true
                }
            );

            if (result.rowsAffected > 0) {
                return {
                    success: true,
                    vehicleId
                };
            }

            return {
                success: false
            };

        } catch (err) {
            console.log(
                "Error inserting subway train:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}


async function generateVehicleID(connection) {
    const result = await connection.execute(`
        SELECT MAX(VehicleID)
        FROM SubwayTrain
    `);

    const maxID = result.rows[0][0];

    if (!maxID) {
        return "V000000001";
    }

    const number =
        parseInt(maxID.substring(1)) + 1;

    return "V" + String(number).padStart(9, "0");
}

async function getSubwayTrainByTrainSetNumber(trainSetNumber) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                SELECT
                    st.VehicleID,
                    st.TrainSetNumber,
                    st.ModelName,
                    tm.NumberOfCars,
                    st.ManufactureYear,
                    st.Capacity,
                    st.WheelchairAccessibility,
                    r.RouteNumber
                FROM SubwayTrain st
                JOIN TrainModel tm
                    ON st.ModelName = tm.ModelName
                LEFT JOIN RunsOn ro
                    ON st.VehicleID = ro.VehicleID
                LEFT JOIN Route r
                    ON ro.RouteID = r.RouteID
                WHERE st.TrainSetNumber = :trainSetNumber
                ORDER BY r.RouteNumber
                `,
                {
                    trainSetNumber
                }
            );

            if (result.rows.length === 0) {
                return null;
            }

            const firstRow = result.rows[0];

            return {
                vehicleId: firstRow[0],
                trainSetNumber: firstRow[1],
                modelName: firstRow[2],
                numberOfCars: firstRow[3],
                manufactureYear: firstRow[4],
                capacity: firstRow[5],
                wheelchairAccessibility: firstRow[6],
                routeNumbers: result.rows
                    .map(row => row[7])
                    .filter(routeNumber => routeNumber !== null)
            };

        } catch (err) {
            console.log(
                "Error retrieving subway train:",
                err.message
            );

            return null;
        }
    });
}

async function registerTrainOnRoute(
    vehicleId,
    routeId
) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `
                INSERT INTO RunsOn
                (
                    VehicleID,
                    RouteID
                )
                VALUES
                (
                    :vehicleId,
                    :routeId
                )
                `,
                {
                    vehicleId,
                    routeId
                },
                {
                    autoCommit: true
                }
            );

            if (result.rowsAffected > 0) {
                return {
                    success: true,
                    vehicleId,
                    routeId
                };
            }

            return {
                success: false
            };

        } catch (err) {
            console.log(
                "Error registering train on route:",
                err.message
            );

            return {
                success: false
            };
        }
    });
}


module.exports = {
    insertTrainModel,
    insertSubwayTrain,
    getSubwayTrainByTrainSetNumber,
    registerTrainOnRoute
};