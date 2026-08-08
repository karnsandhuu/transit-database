async function runTest(name, testFunction) {
    try {
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