const passService = require('../services/passService');
const passengerService = require('../services/passengerService');
const { runTest } = require('./testUtils');

async function createTestPassenger() {
    const result = await passengerService.insertPassenger(
        'Test',
        'Passenger'
    );

    ```
if (!result.success) {
    throw new Error('Failed to create test passenger');
}

return result.passengerId;
```

}

/*

* Test purchasing a Zone Pass
  */
async function testPurchaseZonePass() {
    const passengerId = await createTestPassenger();

    const result = await passService.purchasePassForPassenger(
        passengerId,
        'Zone',
        10.00,
        2
    );

    if (!result.success) {
        throw new Error('Zone pass purchase failed');
    }

    if (!result.ticketId) {
        throw new Error('No ticket ID returned');
    }
}

/*

* Test purchasing a Timed Pass
  */
async function testPurchaseTimedPass() {
    const passengerId = await createTestPassenger();

    const result = await passService.purchasePassForPassenger(
        passengerId,
        'Timed',
        50.00,
        null,
        'Monthly'
    );

    if (!result.success) {
        throw new Error('Timed pass purchase failed');
    }

    if (!result.ticketId) {
        throw new Error('No ticket ID returned');
    }
}

/*

* Test that an invalid pass type is rejected
  */
async function testInvalidPassType() {
    const passengerId = await createTestPassenger();

    const result = await passService.purchasePassForPassenger(
        passengerId,
        'Invalid',
        10.00
    );

    if (result.success) {
        throw new Error('Invalid pass type was accepted');
    }
}

/*

* Test that a Zone Pass requires the number of valid zones
  */
async function testZonePassRequiresZones() {
    const passengerId = await createTestPassenger();

    const result = await passService.purchasePassForPassenger(
        passengerId,
        'Zone',
        10.00
    );

    if (result.success) {
        throw new Error(
            'Zone pass was created without a number of valid zones'
        );
    }
}

/*

* Test that a Timed Pass requires a timed pass type
  */
async function testTimedPassRequiresType() {
    const passengerId = await createTestPassenger();

    const result = await passService.purchasePassForPassenger(
        passengerId,
        'Timed',
        50.00
    );

    if (result.success) {
        throw new Error(
            'Timed pass was created without a timed pass type'
        );
    }
}

/*

* Test retrieving passes belonging to a passenger
  */
async function testGetPassesByPassengerId() {
    const passengerId = await createTestPassenger();

    const purchaseResult =
        await passService.purchasePassForPassenger(
            passengerId,
            'Zone',
            10.00,
            2
        );

    if (!purchaseResult.success) {
        throw new Error('Failed to create test pass');
    }

    const passes =
        await passService.getPassesByPassengerId(passengerId);

    if (!Array.isArray(passes)) {
        throw new Error('Expected an array of passes');
    }

    if (passes.length === 0) {
        throw new Error('Passenger should have at least one pass');
    }

    const pass = passes.find(
        p => p.ticketId === purchaseResult.ticketId
    );

    if (!pass) {
        throw new Error('Purchased pass was not returned');
    }

    if (pass.passType !== 'Zone') {
        throw new Error('Pass type should be Zone');
    }

    if (pass.numberOfValidZones !== 2) {
        throw new Error('Number of valid zones is incorrect');
    }
}

/*

* Test topping up a timed pass
  */
async function testTopUpTimedPass() {
    const passengerId = await createTestPassenger();

    const purchaseResult =
        await passService.purchasePassForPassenger(
            passengerId,
            'Timed',
            50.00,
            null,
            'Monthly'
        );

    if (!purchaseResult.success) {
        throw new Error('Failed to create timed pass');
    }

    const ticketId = purchaseResult.ticketId;

    const topUpResult =
        await passService.topUpTimedPass(
            ticketId,
            20.00,
            'Monthly'
        );

    if (!topUpResult.success) {
        throw new Error('Timed pass top-up failed');
    }

    if (topUpResult.ticketId !== ticketId) {
        throw new Error('Top-up returned incorrect ticket ID');
    }
}

/*

* Run all pass service tests
  */
module.exports = async function runPassTests() {

    await runTest(
        'purchase Zone Pass',
        testPurchaseZonePass
    );

    await runTest(
        'purchase Timed Pass',
        testPurchaseTimedPass
    );

    await runTest(
        'reject invalid pass type',
        testInvalidPassType
    );

    await runTest(
        'require number of zones for Zone Pass',
        testZonePassRequiresZones
    );

    await runTest(
        'require pass type for Timed Pass',
        testTimedPassRequiresType
    );

    await runTest(
        'get passes by passenger ID',
        testGetPassesByPassengerId
    );

    await runTest(
        'top up Timed Pass',
        testTopUpTimedPass
    );
};
