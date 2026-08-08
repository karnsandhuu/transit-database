# Passenger API

The Passenger API provides endpoints for creating passengers, retrieving an individual passenger, and updating a passenger's category.

**Base path:** `/passengers`

The API is implemented through:

```text
routes/passengerRoutes.js
controllers/passengerController.js
services/passengerService.js
```

---

## POST `/passengers`

Creates a new passenger.

The `PassengerID` is generated automatically by the server. The client does not provide the passenger ID.

### Request Body

```json
{
    "firstName": "John",
    "lastName": "Smith",
    "passengerType": "Student"
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `firstName` | String | Yes | Passenger's first name |
| `lastName` | String | Yes | Passenger's last name |
| `passengerType` | String | No | Passenger category. Defaults to `Adult` |

Valid passenger categories:

```text
Adult
Child
Senior
Student
```

If `passengerType` is omitted, the passenger is assigned:

```text
Adult
```

### Successful Response

**Status:** `201 Created`

```json
{
    "success": true,
    "passengerId": "P000000001"
}
```

The generated passenger ID is returned to the client.

### Failed Response

**Status:** `400 Bad Request`

```json
{
    "success": false,
    "message": "Unable to create passenger"
}
```

---

## GET `/passengers/:passengerId`

Retrieves a specific passenger using their passenger ID.

The client can optionally specify which passenger attributes to retrieve and the order in which they should appear. The selected attributes are used to construct the SQL `SELECT` clause, so non-selected attributes are not retrieved from the database.

### Path Parameter

| Parameter | Type | Description |
|---|---|---|
| `passengerId` | String | ID of the passenger to retrieve |

### Query Parameter

| Parameter | Type | Description |
|---|---|---|
| `attributes` | String | Comma-separated list of passenger attributes to retrieve, in the desired order |

### Available Attributes

| Attribute | Description |
|---|---|
| `passengerId` | Unique ID of the passenger |
| `firstName` | Passenger's first name |
| `lastName` | Passenger's last name |
| `passengerCategory` | Passenger's category |

### Example Request

Retrieve all passenger attributes:

```text
GET /passengers/P000000001
```

Retrieve only the passenger's last name and passenger ID:

```text
GET /passengers/P000000001?attributes=lastName,passengerId
```

Retrieve attributes in a custom order:

```text
GET /passengers/P000000001?attributes=passengerCategory,lastName,passengerId
```

For the last request, the database query will retrieve the attributes in the specified order:

```sql
SELECT PassengerCategory, LastName, PassengerID
FROM Passenger
WHERE PassengerID = :passengerId
```

### Successful Response

**Status:** `200 OK`

When no `attributes` parameter is provided, all passenger attributes are returned:

```json
{
    "passengerId": "P000000001",
    "firstName": "John",
    "lastName": "Smith",
    "passengerCategory": "Student"
}
```

When attributes are specified, only the selected attributes are returned:

```text
GET /passengers/P000000001?attributes=lastName,passengerId
```

```json
{
    "lastName": "Smith",
    "passengerId": "P000000001"
}
```

### Passenger Not Found

**Status:** `404 Not Found`

```json
{
    "message": "Passenger not found"
}
```

### Invalid Attribute

If an attribute that is not supported is requested, the server returns:

**Status:** `400 Bad Request`

```json
{
    "message": "Invalid passenger attribute: invalidAttribute"
}
```

---

## PATCH `/passengers/:passengerId/type`

Updates the passenger category of an existing passenger.

The passenger's first name, last name, and passenger ID are not changed.

### Path Parameter

| Parameter | Type | Description |
|---|---|---|
| `passengerId` | String | ID of the passenger to update |

### Request Body

```json
{
    "passengerType": "Senior"
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `passengerType` | String | Yes | New passenger category |

Valid passenger categories:

```text
Adult
Child
Senior
Student
```

### Successful Response

**Status:** `200 OK`

```json
{
    "success": true
}
```

### Passenger Not Found

**Status:** `404 Not Found`

```json
{
    "success": false,
    "message": "Passenger not found"
}
```

---

## API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/passengers` | Create a passenger |
| `GET` | `/passengers/:passengerId` | Retrieve one passenger |
| `PATCH` | `/passengers/:passengerId/type` | Update passenger category |

### Internal Service Functions

The following service function exists but is **not exposed through the API**:

```text
getAllPassengers()
```

It may be used internally or for testing, but there is intentionally no corresponding frontend route. This prevents clients from retrieving the entire passenger database.