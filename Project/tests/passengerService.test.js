const passengerService = require('../services/passengerService');
const { resetDatabase } = require("../services/databaseService");
const { withOracleDB } = require('../db/oracle');

async function testInsertPassenger() {

    const result = await passengerService.insertPassenger(
        "John",
        "Smith"
    );

    console.log("Insert result:", result);

    if (!result.success) {
        throw new Error("Insert passenger failed");
    }

    console.log(
        "Generated ID:",
        result.passengerId
    );
}

async function testInsertPassenger2() {

    const result = await passengerService.insertPassenger(
        "Jane",
        "Doe"
    );

    console.log("Insert result:", result);

    if (!result.success) {
        throw new Error("Insert passenger failed");
    }

    console.log(
        "Generated ID:",
        result.passengerId
    );
}

async function testGetAllPassengers() {

    const passengers =
        await passengerService.getAllPassengers();
    if (!passengers || passengers.length === 0) {
        throw new Error("No passengers found");
    }
    console.log(passengers);

}

async function testGetPassengerByID() {

    const passenger =
        await passengerService.getPassengerById(
            "P000000001"
        );

    console.log(passenger);

}

async function testGetPassengerByID() {

    const passenger =
        await passengerService.getPassengerById(
            "P000000099"
        );
    if (passenger === null) {
        console.log("Passenger not found");
    } else {
        throw new Error("Passenger should not exist");
    }

}

async function testUpdatePassengerType() {

    const result =
        await passengerService.updatePassengerType(
            "P000000001",
            "Student"
        );
    if (!result) {
        throw new Error("Update passenger type failed");
    }

    const updatedPassenger =
        await passengerService.getPassengerById(
            "P000000001"
        );

    console.log("Updated passenger:", updatedPassenger);

}   

module.exports = async function () {

    console.log("Initializing database...");
    await resetDatabase();
    await testInsertPassenger();
    await testInsertPassenger2();
    await testGetAllPassengers();
    await testGetPassengerByID();
    await testUpdatePassengerType();

};