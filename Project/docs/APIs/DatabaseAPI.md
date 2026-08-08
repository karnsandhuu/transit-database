# Database API

## Check Database Connection

### Endpoint

```
GET /database/check-db-connection
```

### Purpose

Checks whether the backend application can establish a connection with the Oracle database.

This endpoint is mainly used for:

- Verifying that the Oracle database is available.
- Debugging database configuration issues.
- Checking that the backend database connection pool is working.

---

## Request

### Method

```
GET
```

### Parameters

None.

### Request Body

None.

---

## Response

### Successful Connection

Condition:

The database service successfully obtains an Oracle database connection.

Service result:

```javascript
true
```

HTTP Response:

```
200 OK
```

Response Body:

```
connected
```

---

### Failed Connection

Condition:

The database service fails to establish a database connection.

Service result:

```javascript
false
```

HTTP Response:

```
200 OK
```

Response Body:

```
unable to connect
```

---

## Backend Flow

```
GET /database/check-db-connection

        |
        v

databaseController.checkConnection()

        |
        v

databaseService.testOracleConnection()

        |
        v

Oracle Database
```

---

## Related Files

Route:

```
routes/databaseRoutes.js
```

Controller:

```
controllers/databaseController.js
```

Service:

```
services/databaseService.js
```

Database Connection:

```
db/oracle.js
```

