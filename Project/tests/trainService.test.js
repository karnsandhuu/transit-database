const assert = require('assert');

const trainService = require('../services/trainService');
const routeService = require('../services/routeService');
const { runTest } = require('./testUtils');
const databaseService = require('../services/databaseService');

// Test data
const MODEL_NAME = 'TestTrainModel';
const TRAIN_SET_NUMBER = 'TEST-001';
const ROUTE_NUMBER = 999;

let vehicleId;
let routeId;

// Create a test train model
async function testInsertTrainModel() {
    const result = await trainService.insertTrainModel(
        MODEL_NAME,
        6
    );

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.modelName, MODEL_NAME);

}

// Create a test subway train
async function testInsertSubwayTrain() {
    const result = await trainService.insertSubwayTrain(
        TRAIN_SET_NUMBER,
        MODEL_NAME,
        2020,
        500,
        'Y'
    );

    assert.strictEqual(result.success, true);
    assert.ok(result.vehicleId);

    vehicleId = result.vehicleId;

}

// Get train information before it is registered
async function testGetSubwayTrain() {
    const result =
        await trainService.getSubwayTrainByTrainSetNumber(
            TRAIN_SET_NUMBER
        );

    assert.ok(result);

    assert.strictEqual(result.vehicleId, vehicleId);
    assert.strictEqual(
        result.trainSetNumber,
        TRAIN_SET_NUMBER
    );
    assert.strictEqual(
        result.modelName,
        MODEL_NAME
    );
    assert.strictEqual(
        result.numberOfCars,
        6
    );
    assert.strictEqual(
        result.manufactureYear,
        2020
    );
    assert.strictEqual(
        result.capacity,
        500
    );
    assert.strictEqual(
        result.wheelchairAccessibility,
        'Y'
    );

    assert.deepStrictEqual(
        result.routeNumbers,
        []
    );

}

// Create a test route
async function createTestRoute() {
    const result = await routeService.insertRoute(
        ROUTE_NUMBER,
        'Test Route',
        'Route for train service testing',
        'Blue'
    );

    if (!result.success) {
        throw new Error('Failed to create test route');
    }

    routeId = result.routeId;

}

// Register the train on the route
async function testRegisterTrainOnRoute() {
    const result = await trainService.registerTrainOnRoute(
        vehicleId,
        routeId
    );

    assert.strictEqual(result.success, true);
    assert.strictEqual(
        result.vehicleId,
        vehicleId
    );
    assert.strictEqual(
        result.routeId,
        routeId
    );

}

// Get train information after registration
async function testGetSubwayTrainWithRoute() {
    const result =
        await trainService.getSubwayTrainByTrainSetNumber(
            TRAIN_SET_NUMBER
        );

    assert.ok(result);

    assert.strictEqual(
        result.vehicleId,
        vehicleId
    );

    assert.strictEqual(
        result.trainSetNumber,
        TRAIN_SET_NUMBER
    );

    assert.ok(
        result.routeNumbers.includes(ROUTE_NUMBER)
    );

}

// Test retrieving a train that does not exist
async function testGetNonexistentTrain() {
    const result =
        await trainService.getSubwayTrainByTrainSetNumber(
            'DOES-NOT-EXIST'
        );

    assert.strictEqual(result, null);

}

// Run all train service tests
module.exports = async function runTrainTests() {
    await databaseService.resetDatabase();

    await runTest(
        'insert train model',
        testInsertTrainModel
    );

    await runTest(
        'insert subway train',
        testInsertSubwayTrain
    );

    await runTest(
        'get subway train by train-set number',
        testGetSubwayTrain
    );

    await createTestRoute();

    await runTest(
        'register train on route',
        testRegisterTrainOnRoute
    );

    await runTest(
        'get subway train with route',
        testGetSubwayTrainWithRoute
    );

    await runTest(
        'get nonexistent subway train',
        testGetNonexistentTrain
    );

};