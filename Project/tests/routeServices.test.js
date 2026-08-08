const routeService = require('../services/routeService');
const stationService = require('../services/stationService');
const databaseService = require('../services/databaseService');
const { runTest } = require('./testUtils');


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


async function createTestRoute(routeNumber) {
    const result = await routeService.insertRoute(
        routeNumber,
        `Test Route ${routeNumber}`,
        'Route used for testing',
        null
    );

    if (!result.success) {
        throw new Error('Failed to create test route');
    }

    return result.routeId;
}


async function testInsertRoute() {
    const routeNumber = 1;

    const result = await routeService.insertRoute(
        routeNumber,
        'Test Route',
        'Route used for testing',
        'Blue'
    );

    if (!result.success) {
        throw new Error('Route insertion should succeed');
    }

    if (!result.routeId) {
        throw new Error('Route ID should be generated');
    }
}


async function testGetRouteById() {
    const routeId = await createTestRoute(2);

    const result = await routeService.getRouteById(routeId);

    if (!result) {
        throw new Error('Route should be found');
    }

    if (result.routeId !== routeId) {
        throw new Error('Returned route ID is incorrect');
    }

    if (result.routeNumber !== 2) {
        throw new Error('Returned route number is incorrect');
    }
}


async function testGetRouteByNumber() {
    await createTestRoute(3);

    const result = await routeService.getRouteByNumber(3);

    if (!result) {
        throw new Error('Route should be found');
    }

    if (result.routeNumber !== 3) {
        throw new Error('Returned route number is incorrect');
    }
}


async function testInsertSchedule() {
    const routeId = await createTestRoute(4);

    const result = await routeService.insertSchedule(
        routeId,
        '06:00',
        'Weekday',
        '22:00',
        10
    );

    if (!result.success) {
        throw new Error('Schedule insertion should succeed');
    }
}


async function testInsertRouteStop() {
    await createTestZone(5);

    const stationId = await createTestStation(5);

    const routeId = await createTestRoute(5);

    const result = await routeService.insertRouteStop(
        routeId,
        1,
        stationId
    );

    if (!result.success) {
        throw new Error('Route stop insertion should succeed');
    }
}


async function testGetRouteStopsByRouteNumber() {
    await createTestZone(6);

    const station1 = await createTestStation(6);
    const station2 = await createTestStation(6);
    const station3 = await createTestStation(6);

    const routeId = await createTestRoute(6);

    // Insert stops out of sequence.
    await routeService.insertRouteStop(
        routeId,
        1,
        station1
    );

    await routeService.insertRouteStop(
        routeId,
        3,
        station3
    );

    await routeService.insertRouteStop(
        routeId,
        4,
        station2
    );

    const result = await routeService.getRouteStopsByRouteNumber(6);

    if (!result) {
        throw new Error('Route stops should be returned');
    }

    if (result.length !== 3) {
        throw new Error('Expected three route stops');
    }

    // Stops should be returned in sequence order.
    if (result[0].stopNumber !== 1) {
        throw new Error('First stop should have sequence number 1');
    }

    if (result[1].stopNumber !== 2) {
        throw new Error('Second stop should have sequence number 2');
    }

    if (result[2].stopNumber !== 3) {
        throw new Error('Third stop should have sequence number 3');
    }

    // Route ID should not be included.
    if (result[0].routeId !== undefined) {
        throw new Error('Route ID should not be returned');
    }
}


module.exports = async function runRouteTests() {

    console.log('Initializing route service tests...');
    await databaseService.resetDatabase();

    await runTest(
        'insert route',
        testInsertRoute
    );

    await runTest(
        'get route by ID',
        testGetRouteById
    );

    await runTest(
        'get route by number',
        testGetRouteByNumber
    );

    await runTest(
        'insert schedule',
        testInsertSchedule
    );

    await runTest(
        'insert route stop',
        testInsertRouteStop
    );

    await runTest(
        'get route stops by route number',
        testGetRouteStopsByRouteNumber
    );

    console.log('Route service tests completed.');
};