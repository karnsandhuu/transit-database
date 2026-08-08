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
            "P000000001",
            [
                "passengerId",
                "firstName",
                "lastName",
                "passengerCategory"
            ]
        );

    if (!passenger) {
        throw new Error("Passenger should exist");
    }

    console.log("Passenger:", passenger);
}


async function testGetPassengerProjection() {
    const passenger =
        await passengerService.getPassengerById(
            "P000000001",
            [
                "lastName",
                "passengerId"
            ]
        );

    if (!passenger) {
        throw new Error("Passenger should exist");
    }

    // Only the requested attributes should be returned
    const keys = Object.keys(passenger);

    if (
        keys.length !== 2 ||
        keys[0] !== "lastName" ||
        keys[1] !== "passengerId"
    ) {
        throw new Error(
            "Passenger attributes were not returned in the requested order"
        );
    }

    if (!("lastName" in passenger)) {
        throw new Error("lastName should be returned");
    }

    if (!("passengerId" in passenger)) {
        throw new Error("passengerId should be returned");
    }

    if ("firstName" in passenger) {
        throw new Error("firstName should not be returned");
    }

    if ("passengerType" in passenger) {
        throw new Error("passengerType should not be returned");
    }

    console.log(
        "Projection test passed:",
        passenger
    );
}


async function testGetPassengerByIDNotFound() {
    const passenger =
        await passengerService.getPassengerById(
            "P000000099",
            [
                "passengerId",
                "firstName"
            ]
        );

    if (passenger !== null) {
        throw new Error("Passenger should not exist");
    }

    console.log("Passenger not found test passed");
}


async function testUpdatePassengerCategory() {

    const result =
        await passengerService.updatePassengerCategory(
            "P000000001",
            "Student"
        );
    if (!result) {
        throw new Error("Update passenger category failed");
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
    await testGetPassengerProjection();
    await testGetPassengerByIDNotFound();
    await testUpdatePassengerCategory();

};