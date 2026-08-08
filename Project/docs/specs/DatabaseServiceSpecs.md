# Database Service Function Specifications

## Overview

`databaseService.js` manages the lifecycle of the transport database. It is responsible for initializing the database schema, clearing existing tables, resetting the database, and verifying the Oracle database connection.

This service does **not** contain application-level business logic. Operations involving passengers, routes, vehicles, passes, and stations should be implemented in their corresponding service files.

---

# initializeDatabase()

## Purpose

Creates all tables required by the transport database using the schema defined in:

```
db/transportSchema.sql
```

## Input

None.

## Output

Returns:

```javascript
true
```

if all tables are successfully created.

Throws an error if any SQL statement fails.

## Behavior

1. Reads the database schema file.
2. Separates the SQL file into individual SQL statements.
3. Executes each statement sequentially.
4. Stops execution if a table creation fails.

## Example

```javascript
const success = await initializeDatabase();
```

---

# clearDatabase()

## Purpose

Removes all existing database tables from the transport database.

## Input

None.

## Output

Returns after all tables have been processed.

## Behavior

Drops tables using:

```sql
DROP TABLE <table_name> CASCADE CONSTRAINTS
```

Tables are removed in dependency order to avoid foreign key constraint errors.

The current drop order includes:

```
PassExit
PassEnter
ValidExitAt
ValidEntranceAt
RunsOn
Gate
RouteStop
TransportStation
Schedule
Route
TimedPass
ZonePass
Passes
Passenger
SubwayTrain
Bus
TrainModel
Transport
Zone
```

If a table does not exist, the function skips it and continues.

---

# resetDatabase()

## Purpose

Resets the database to a clean state.

## Input

None.

## Output

Returns after the database has been reset.

## Behavior

Performs the following operations:

```
clearDatabase()
        |
        v
initializeDatabase()
```

After completion, the database contains a fresh copy of all tables defined in `transportSchema.sql`.

## Example

```javascript
await resetDatabase();
```

## Usage

Primarily used for:

- Development setup
- Automated testing
- Restoring a known database state

---

# testOracleConnection()

## Purpose

Checks whether the application can successfully connect to the Oracle database.

## Input

None.

## Output

Returns:

```javascript
true
```

if a database connection can be established.

Returns:

```javascript
false
```

if the connection fails.

## Example

```javascript
const connected = await testOracleConnection();

if (connected) {
    console.log("Database available");
}
```

---

# Related Files

## Database Schema

```
db/
└── transportSchema.sql
```

Contains the SQL definitions for all database relations.

## Oracle Connection Manager

```
db/
└── oracle.js
```

Provides:

- Oracle connection pool initialization
- Database connection handling
- Connection cleanup

---

# Notes for Developers

- All database initialization should go through this service.
- Do not manually create tables in other service files.
- Business operations should use separate services:
  - `passengerService.js`
  - `routeService.js`
  - `vehicleService.js`
  - etc.
- Tests that depend on database state should call `resetDatabase()` before execution.