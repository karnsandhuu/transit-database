async function runTest(name, testFunction) {
    console.log(`Running test: ${name}`);
    try {
        console.log(`Running test: ${name}`);
        await testFunction();
        console.log(`✓ ${name}`);
    } catch (err) {
        console.error(`✗ ${name}`);
        console.error(err);
    }
}

module.exports = {
    runTest
};