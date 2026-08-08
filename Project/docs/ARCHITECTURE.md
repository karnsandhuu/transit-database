# Project Structure Overview

This project follows a layered backend structure to separate database access, business logic, HTTP handling, and application configuration. The goal is to make the code easier to maintain, extend, and test.

## Directory Structure

```
CPSC304_Project/
│
├── server.js
├── app.js
├── routes/
├── controllers/
├── services/
├── db/
├── tests/
├── public/
├── scripts/
└── utils/
```

---

## Application Startup

### `server.js`

The entry point of the backend application.

Responsibilities:
- Loads environment configuration
- Initializes the Oracle database connection pool
- Starts the Express server

The server should only handle application startup. It should not contain route definitions or database queries.

---

### `app.js`

Defines and configures the Express application.

Responsibilities:
- Creates the Express app
- Registers middleware
- Mounts route files

Example responsibilities:
- Enable JSON request parsing
- Serve frontend static files
- Attach API routes

`app.js` does not start the server or initialize the database. This makes it easier to test the backend without running the entire application.

---

# Backend Layers

## `routes/`

Contains Express route definitions.

Responsibilities:
- Defines URL endpoints
- Connects endpoints to controllers

Example:

```
GET /check-db-connection
        |
        ↓
controller.checkConnection
```

Routes should not contain SQL queries or business logic.

---

## `controllers/`

Handles HTTP requests and responses.

Responsibilities:
- Receives requests from routes
- Calls the appropriate service functions
- Sends responses back to the client

Example flow:

```
Request
   |
   ↓
Controller
   |
   ↓
Service
   |
   ↓
Database
```

Controllers should not directly access the database.

---

## `services/`

Contains application/business logic.

Responsibilities:
- Implements application operations
- Communicates with the database layer
- Processes data before returning results

Example:

```
passengerService.js
routeService.js
ticketService.js
```

Services should not handle HTTP requests or responses.

---

## `db/`

Contains database-related code.

Example:

```
db/
└── oracle.js
```

Responsibilities:
- Configure Oracle connection
- Initialize connection pool
- Provide reusable database connection functions

Database connection management should stay here instead of being duplicated across services.

---

# Testing

## `tests/`

Contains backend tests that directly test service functions.

Example:

```
tests/
├── testRunner.js
├── testUtils.js
└── appService.test.js
```

### `testRunner.js`

Responsible for:
- Initializing the Oracle connection pool once
- Running all test files
- Closing the database connection after testing

### `testUtils.js`

Contains reusable testing utilities, such as:
- Test wrappers
- Error handling
- Test output formatting

### `*.test.js`

Contains tests for individual services.

Tests should call service functions directly rather than sending HTTP requests.

Example:

```
appService.test.js
        |
        ↓
appService.js
        |
        ↓
Oracle Database
```

---

# Frontend

## `public/`

Contains frontend files served by Express.

Example:

```
public/
├── index.html
├── scripts.js
└── styles.css
```

Responsibilities:
- User interface
- Browser-side JavaScript
- Styling

Frontend communicates with the backend through routes defined in `routes/`.

---

# Scripts

## `scripts/`

Contains environment setup scripts.

Example:

```
scripts/
├── mac/
│   ├── db-tunnel.sh
│   └── instantclient-setup.sh
└── win/
```

Used for:
- SSH tunneling to Oracle database
- Oracle Instant Client setup
- Environment configuration

---

# Utilities

## `utils/`

Contains reusable helper functions.

Example:

```
utils/
└── envUtil.js
```

Used for common functionality such as:
- Loading environment variables
- Shared helper methods

---

# Request Flow Overview

A typical request follows this path:

```
Frontend
   |
   | HTTP Request
   ↓
routes/
   |
   ↓
controllers/
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

This separation allows:
- Routes to focus on URLs
- Controllers to focus on HTTP handling
- Services to focus on logic
- Database code to stay reusable
- Tests to run without starting the server