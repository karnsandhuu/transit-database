# Testing the Project

## Overview

The project uses backend service tests that directly test the service layer without starting the Express server.

The testing flow is:

```text
tests/
    |
    ↓
services/
    |
    ↓
db/
    |
    ↓
Oracle Database
```

This allows us to test database operations and application logic independently from the frontend and HTTP routes.

---

# Before Running Tests

The Oracle database connection requires:

1. Oracle SSH tunnel
2. Oracle Instant Client environment variable

## 1. Start the Oracle SSH Tunnel

Open a terminal and navigate to the project folder:

```bash
cd CPSC304_Project
```

Run:

```bash
sh ./scripts/mac/db-tunnel.sh
```

or on Windows:

```cmd
.\scripts\win\db-tunnel.cmd
```

Keep this terminal open while testing.

---

## 2. Configure Oracle Instant Client (Only For Local Setup)

Open a second terminal.

Set the Oracle Instant Client path:

### Mac

```bash
export DYLD_LIBRARY_PATH=/path/to/instantclient:$DYLD_LIBRARY_PATH
```

Example:

```bash
export DYLD_LIBRARY_PATH=/Users/<username>/Documents/CPSC_304/instantclient_19_8:$DYLD_LIBRARY_PATH
```

### Windows

Run the provided setup script:

```cmd
.\scripts\win\instantclient-setup.cmd
```

---

# Running Tests

From the project root:

```bash
node tests/testRunner.js
```

The test runner will:

1. Initialize the Oracle connection pool
2. Run all registered test files
3. Close the database connection after testing

Example:

```text
Connection pool started

Running appService tests...

✓ fetch demotable
✓ insert demotable
✓ count demotable

Pool closed
```

---

# Adding New Tests

New tests should be added inside the `tests/` directory.

Example:

```text
tests/
├── testRunner.js
├── testUtils.js
├── appService.test.js
├── passengerService.test.js
└── routeService.test.js
```

Each test file should export a function that runs its tests.

Example:

```javascript
module.exports = async function runPassengerTests() {
    await runTest(
        "fetch passengers",
        testFetchPassengers
    );
};
```

Then register the test file in `testRunner.js`:

```javascript
await require('./passengerService.test')();
```

---

# Testing Guidelines

## Test Services, Not Controllers

Tests should directly call service functions:

Recommended:

```javascript
await passengerService.getPassengers();
```

Avoid testing through HTTP requests unless specifically testing routes.

---

## Keep Database Setup Outside Tests

Do not initialize the Oracle connection pool inside individual test files.

The connection pool should be created once in:

```text
tests/testRunner.js
```

and shared by all tests.

---

## Test File Responsibilities

### `testRunner.js`

Responsible for:
- Database initialization
- Running all tests
- Closing database connections

### `testUtils.js`

Responsible for:
- Common testing utilities
- Error handling
- Test result formatting

### `*.test.js`

Responsible for:
- Calling service functions
- Checking expected results

---

# Troubleshooting

## DPI-1047 Oracle Client Error

Example:

```text
DPI-1047: Cannot locate a 64-bit Oracle Client library
```

Cause:
- Oracle Instant Client path is not configured.

Solution:

```bash
export DYLD_LIBRARY_PATH=/path/to/instantclient:$DYLD_LIBRARY_PATH
```

---

## NJS-047 Pool Error

Example:

```text
NJS-047: poolAlias "default" not found
```

Cause:
- The database connection pool was not initialized before running tests.

Solution:
- Run tests through `testRunner.js`
- Do not initialize the pool inside individual test files

---

## Database Connection Timeout

Cause:
- SSH tunnel is not running.

Solution:
- Start `db-tunnel.sh` and keep the terminal open.