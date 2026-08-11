# CPSC304 Project
**!!New SQLs are found in the Project/db folder!!**
## Overview

This project is a database-driven application developed for CPSC 304. The backend is built using **Node.js**, **Express**, and **Oracle Database**.

The project follows a layered architecture to separate:
- HTTP request handling
- Application logic
- Database access
- Testing

This structure makes the project easier to maintain, extend, and test as more features are added.

---

# Project Setup

Please refer to the [sample project setup instructions here](https://www.students.cs.ubc.ca/~cs-304/resources/javascript-oracle-resources/node-setup.html#remote-deploy-item) for more in-depth instructions.

## Prerequisites

- Access to UBC CS undergrad server

## Setup Instructions (Remote)

### 1. Create Environment File

Create a `.env` file in the root directory of the project with the following contents:

```
# TODO: Edit the values below this line according to the given placeholders
# Replace 'ora_YOUR-CWL-USERNAME' with "ora_" (no quotation marks) followed by your CWL username.
ORACLE_USER=ora_YOUR-CWL-USERNAME
# Replace 'YOUR-STUDENT-NUMBER' with your actual student number.
ORACLE_PASS=aYOUR-STUDENT-NUMBER


#Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)
PORT=65535

# -------------- The three lines below should be left unaltered --------------
ORACLE_HOST=dbhost.students.cs.ubc.ca
ORACLE_PORT=1522
ORACLE_DBNAME=stu

```

### 2. Configure Team Number
**Only perform this step if you want to run the project on the remote servers**

Open the `remote-start.sh` script and set your team number:

```bash
TEAM_NUMBER=... # Replace ... with your actual team number here
```

### 3. Run the Application

Execute the remote start script:

```bash
./remote-start.sh
```

## Setup Instructions (Local)
See:
- [Local Setup Guide](docs/SETUP.md)
After setup, start the server:

```bash
sh local-start.sh
```

The server will start at:

```text
http://localhost:<PORT>
```

---

# Testing

Backend tests directly test service functions without starting the Express server.

Before running tests:

1. Start the Oracle SSH tunnel
2. Configure Oracle Instant Client
3. Run:

```bash
node tests/testRunner.js
```

For detailed testing instructions, see:

- [Testing Guide](docs/TESTING.md)

---

# Project Structure

The project uses a layered backend architecture:

```text
Frontend
   |
   ↓
Routes
   |
   ↓
Controllers
   |
   ↓
Services
   |
   ↓
Database Layer
   |
   ↓
Oracle Database
```

For a detailed explanation of each directory and file:

- [Project Architecture](docs/ARCHITECTURE.md)

---

# Documentation

Additional documentation:

| Document | Description |
|---|---|
| [Local Setup](docs/SETUP.md) | Installing dependencies, Oracle setup, and running the project locally |
| [Testing](docs/TESTING.md) | Running backend tests and adding new tests |
| [Architecture](docs/ARCHITECTURE.md) | Explanation of project structure and code organization |

---

# Development Guidelines

## Adding New Features

When adding a new backend feature:

1. Add database operations in `services/`
2. Add request handling in `controllers/`
3. Add endpoints in `routes/`
4. Add backend tests in `tests/`

Avoid placing SQL queries directly inside controllers or routes.

---

## Code Organization Rules

### Routes

Responsible for:
- Defining API endpoints
- Connecting URLs to controllers

Should not contain:
- SQL queries
- Business logic

---

### Controllers

Responsible for:
- Receiving HTTP requests
- Calling services
- Sending responses

Should not contain:
- Direct database access

---

### Services

Responsible for:
- Application logic
- Database operations through the database layer

---

### Database Layer

Responsible for:
- Oracle connection management
- Reusable database utilities

---

# Troubleshooting

Common issues and solutions are documented in:

- [Local Setup Guide](docs/SETUP.md)
- [Testing Guide](docs/TESTING.md)

---

