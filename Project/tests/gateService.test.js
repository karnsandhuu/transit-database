const gateService = require('../services/gateService');
const passengerService = require('../services/passengerService');
const passService = require('../services/passService');
const stationService = require('../services/stationService');
const { resetDatabase } = require("../services/databaseService");
const { runTest } = require('./testUtils');

async function createTestPassenger() {
    const result = await passengerService.insertPassenger(
        'Test',
        'Passenger'
    );

    if (!result.success) {
        throw new Error('Failed to create test passenger');
    }

    return result.passengerId;
}

async function createTestZone(zoneNumber) {
    const result = await stationService.insertZone(
        zoneNumber,
        `Test Zone ${zoneNumber}`,
        null,
        'Zone used for testing'
    );

    if (!result.success) {
        throw new Error('Failed to create test zone');
    }

    return zoneNumber;
}

async function createTestStation(zoneNumber) {
    const result = await stationService.insertStation(
        zoneNumber,
        `Test Station ${zoneNumber}`,
        'Test Address',
        'Y'
    );

    if (!result.success) {
        throw new Error('Failed to create test station');
    }

    return result.stationId;
}

async function createTestGate(stationId, enterOrExit = 'Enter') {
    const result = await gateService.insertGate(
        stationId,
        'Active',
        enterOrExit
    );

    if (!result.success) {
        throw new Error('Failed to create test gate');
    }

    return result.gateId;
}

async function testEnterGate() {
    const passengerId = await createTestPassenger();

    await createTestZone(1);

    const stationId = await createTestStation(1);

    const gateId = await createTestGate(
        stationId,
        'Enter'
    );

    const pass = await passService.purchasePassForPassenger(
        passengerId,
        'Timed',
        10,
        null,
        'Daily'
    );

    if (!pass.success) {
        throw new Error('Failed to create test pass');
    }

    const result = await gateService.enterGate(
        pass.ticketId,
        gateId
    );

    if (!result.success) {
        throw new Error('Gate entry should succeed');
    }
}

async function testCannotEnterExitGate() {
    const passengerId = await createTestPassenger();

    await createTestZone(2);

    const stationId = await createTestStation(2);

    const gateId = await createTestGate(
        stationId,
        'Exit'
    );

    const pass = await passService.purchasePassForPassenger(
        passengerId,
        'Timed',
        10,
        null,
        'Daily'
    );

    if (!pass.success) {
        throw new Error('Failed to create test pass');
    }

    const result = await gateService.enterGate(
        pass.ticketId,
        gateId
    );

    if (result.success) {
        throw new Error(
            'Entry through an exit gate should fail'
        );
    }
}

async function testZonePassExit() {
    const passengerId = await createTestPassenger();

    await createTestZone(3);
    await createTestZone(5);

    const entryStationId = await createTestStation(3);
    const exitStationId = await createTestStation(5);

    const entryGateId = await createTestGate(
        entryStationId,
        'Enter'
    );

    const exitGateId = await createTestGate(
        exitStationId,
        'Exit'
    );

    const pass = await passService.purchasePassForPassenger(
        passengerId,
        'Zone',
        5,
        2
    );

    if (!pass.success) {
        throw new Error('Failed to create zone pass');
    }

    // Enter the system first.
    const entryResult = await gateService.enterGate(
        pass.ticketId,
        entryGateId
    );

    if (!entryResult.success) {
        throw new Error('Entry should succeed');
    }

    // Then exit two zones away.
    const exitResult = await gateService.exitGate(
        pass.ticketId,
        exitGateId
    );

    if (!exitResult.success) {
        throw new Error(
            'Zone pass should allow exit within valid zone distance'
        );
    }
}

async function testZonePassExitTooFar() {
    const passengerId = await createTestPassenger();

    await createTestZone(1);
    await createTestZone(5);

    const entryStationId = await createTestStation(1);
    const exitStationId = await createTestStation(5);

    const entryGateId = await createTestGate(
        entryStationId,
        'Enter'
    );

    const exitGateId = await createTestGate(
        exitStationId,
        'Exit'
    );

    const pass = await passService.purchasePassForPassenger(
        passengerId,
        'Zone',
        5,
        2
    );

    if (!pass.success) {
        throw new Error('Failed to create zone pass');
    }

    const entryResult = await gateService.enterGate(
        pass.ticketId,
        entryGateId
    );

    if (!entryResult.success) {
        throw new Error('Entry should succeed');
    }

    const exitResult = await gateService.exitGate(
        pass.ticketId,
        exitGateId
    );

    if (exitResult.success) {
        throw new Error(
            'Zone pass should not allow exit beyond valid zone distance'
        );
    }
}

module.exports = async function runAccessTests() {
    console.log("Initializing database...");

    await resetDatabase();
    await runTest(
        'enter active timed pass',
        testEnterGate
    );

    await resetDatabase();
    await runTest(
        'reject entry through exit gate',
        testCannotEnterExitGate
    );

    await resetDatabase();
    await runTest(
        'zone pass can exit within valid zones',
        testZonePassExit
    );

    await resetDatabase();
    await runTest(
        'zone pass cannot exit beyond valid zones',
        testZonePassExitTooFar
    );
};