# Local Setup Guide

This guide explains how to set up and run the project locally.

The application requires:

- Node.js
- Oracle Database access through the UBC CS server
- Oracle SSH tunnel
- Oracle Instant Client

---

# 1. Install Node.js

Install Node.js from the official Node.js website.

Verify the installation:

```bash
node --version
```

A valid Node.js version should be displayed.

---

# 2. Install Project Dependencies

Navigate to the project root:

```bash
cd CPSC304_Project
```

Install required packages:

```bash
npm install
```

If new dependencies are added during development, run:

```bash
npm install
```

again to update the installed packages.

---

# 3. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```text
# TODO: Edit the values below this line according to the given placeholders
# Replace 'ora_YOUR-CWL-USERNAME' with "ora_" (no quotation marks) followed by your CWL username.
ORACLE_USER=ora_YOUR-CWL-USERNAME
# Replace 'aYOUR-STUDENT-NUMBER' with your actual student number preceeded by the letter a.
ORACLE_PASS=aYOUR-STUDENT-NUMBER


#Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)
PORT=65535

# -------------- The three lines below should be left unaltered --------------
ORACLE_HOST=localhost
ORACLE_PORT=50000
ORACLE_DBNAME=stu
```

Replace the placeholders with your own Oracle database credentials.

Do not commit `.env` to Git.

---

# 4. Set Up Oracle SSH Tunnel

The application cannot directly access the Oracle database. A tunnel is required to connect through the CS department servers.

## Mac

Open a terminal in the project directory:

```bash
cd CPSC304_Project
```

Run:

```bash
sh ./scripts/mac/db-tunnel.sh
```

Enter your CWL password when prompted.

Keep this terminal open while running the application.

## Windows

Run:

```cmd
.\scripts\win\db-tunnel.cmd
```

Keep the terminal open.

---

# 5. Install Oracle Instant Client

The Node.js Oracle driver requires Oracle Instant Client libraries.

## Download Oracle Instant Client

Download the **Basic Light** package appropriate for your operating system.

Extract the downloaded ZIP file to a location of your choice.

Example:

```text
/Users/<username>/Documents/CPSC_304/instantclient_19_8
```

---

# 6. Configure Oracle Instant Client

The application needs to know where the Oracle libraries are located.

## Mac

Run:

```bash
sh ./scripts/mac/instantclient-setup.sh
```

When prompted, provide the absolute path of your Instant Client folder.

Example:

```text
/Users/<username>/Documents/CPSC_304/instantclient_19_8
```

This creates:

```text
local-start.sh
```

which automatically configures the Oracle environment before starting the application.

---

## Windows

Run:

```cmd
.\scripts\win\instantclient-setup.cmd
```

Provide the Instant Client path when prompted.

This creates:

```text
local-start.cmd
```

---

# 7. Start the Application

After completing the setup:

## Mac

Run:

```bash
sh local-start.sh
```

## Windows

Run:

```cmd
local-start.cmd
```

If successful, the terminal should display:

```text
Server running
```

Open:

```text
http://localhost:<PORT>
```

in your browser.

---

# 8. First Launch Database Reset

On the first launch, you may see:

```text
ORA-00942: table or view does not exist
```

This is expected.

The application depends on database tables that have not been created yet.

Open the webpage and press the **Reset** button to initialize the required tables.

---

# 9. Common Errors

## Oracle Client Cannot Be Found

Error:

```text
DPI-1047: Cannot locate a 64-bit Oracle Client library
```

Cause:

Oracle Instant Client is not configured.

Solution:

Run:

```bash
sh ./scripts/mac/instantclient-setup.sh
```

or manually set:

```bash
export DYLD_LIBRARY_PATH=/path/to/instantclient:$DYLD_LIBRARY_PATH
```

---

## Port Already in Use

Error:

```text
Error: listen EADDRINUSE
```

Cause:

Another application is already using the configured port.

Solution:

Change:

```text
PORT=
```

in `.env`.

---

## Database Connection Timeout

Cause:

The SSH tunnel is not running.

Solution:

Start:

```bash
sh ./scripts/mac/db-tunnel.sh
```

and keep the terminal open.

---

# Development Workflow

Typical workflow:

```text
1. Start SSH tunnel
        |
        ↓
2. Start application
        |
        ↓
3. Modify code
        |
        ↓
4. Restart server
        |
        ↓
5. Run backend tests
```

For backend testing instructions, see:

`docs/TESTING.md`