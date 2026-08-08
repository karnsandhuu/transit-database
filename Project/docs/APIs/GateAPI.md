# Gate API

## Get Gates by Station

### Endpoint

```text
GET /stations/:stationId/gates
```

### Purpose

Retrieves all gates belonging to a specific station.

This endpoint is used to:

- View all gates associated with a station.
- Determine whether each gate is used for entry or exit.
- Check whether a gate is currently active.
- View the total number of entries and exits recorded by each gate.

---

## Request

### Method

```text
GET
```

### URL Parameters

| Parameter | Type | Description |
|---|---|---|
| `stationId` | String | ID of the station whose gates should be retrieved. |

### Example

```text
GET /stations/S000000001/gates
```

---

## Response

### Success

**Status Code**

```text
200 OK
```

### Response Body

```json
[
    {
        "gateId": "G000000001",
        "stationId": "S000000001",
        "activationStatus": "Active",
        "enterOrExit": "Enter",
        "totalEnterExitCount": 25
    },
    {
        "gateId": "G000000002",
        "stationId": "S000000001",
        "activationStatus": "Active",
        "enterOrExit": "Exit",
        "totalEnterExitCount": 18
    }
]
```

If the station has no gates, an empty array is returned:

```json
[]
```

---

# Enter Gate

### Endpoint

```text
POST /gates/:gateId/enter
```

### Purpose

Processes a passenger attempting to enter the transit system through a specific gate.

The service verifies that:

- The pass exists.
- The pass is active.
- The gate exists.
- The gate is active.
- The gate is configured as an entry gate.

If all conditions are satisfied, an entry record is created in `PassEnter` and the gate's `TotalEnterExitCount` is increased by one.

---

## Request

### Method

```text
POST
```

### URL Parameters

| Parameter | Type | Description |
|---|---|---|
| `gateId` | String | ID of the gate being used for entry. |

### Request Body

```json
{
    "ticketId": "T000000001"
}
```

| Field | Type | Description |
|---|---|---|
| `ticketId` | String | ID of the pass being used. |

### Example

```text
POST /gates/G000000001/enter
```

```json
{
    "ticketId": "T000000001"
}
```

---

## Entry Validation

The entry is accepted only when all of the following conditions are satisfied:

```text
TravellingStatus = "Active"
```

```text
ActivationStatus = "Active"
```

```text
EnterOrExit = "Enter"
```

If any condition fails, the entry is rejected.

---

## Successful Entry

When entry is successful:

1. A record is inserted into `PassEnter`.
2. `EntryTime` is automatically recorded.
3. `TotalEnterExitCount` for the gate is increased by one.
4. The database transaction is committed.

### Response

**Status Code**

```text
200 OK
```

### Response Body

```json
{
    "success": true
}
```

---

## Failed Entry

If the pass or gate does not satisfy the required conditions:

**Status Code**

```text
400 Bad Request
```

### Response Body

```json
{
    "success": false
}
```

---

# Exit Gate

### Endpoint

```text
POST /gates/:gateId/exit
```

### Purpose

Processes a passenger attempting to exit the transit system through a specific gate.

The service verifies that:

- The gate exists.
- The gate is active.
- The gate is configured as an exit gate.
- The pass has a valid previous entry.
- A Zone Pass has not exceeded its permitted zone distance.

Timed Passes do not require zone-distance validation when exiting.

If the exit is valid, a record is inserted into `PassExit` and the gate's `TotalEnterExitCount` is increased by one.

---

## Request

### Method

```text
POST
```

### URL Parameters

| Parameter | Type | Description |
|---|---|---|
| `gateId` | String | ID of the gate being used for exit. |

### Request Body

```json
{
    "ticketId": "T000000001"
}
```

| Field | Type | Description |
|---|---|---|
| `ticketId` | String | ID of the pass being used. |

### Example

```text
POST /gates/G000000002/exit
```

```json
{
    "ticketId": "T000000001"
}
```

---

## Exit Validation

The gate must satisfy:

```text
ActivationStatus = "Active"
```

and:

```text
EnterOrExit = "Exit"
```

The pass must also have a valid entry that has not already been followed by an exit.

---

## Zone Pass Validation

For a Zone Pass, the service compares the zone where the passenger entered with the zone where they are attempting to exit.

The zone distance is calculated as:

```text
|EntryZone - ExitZone|
```

The exit is allowed when:

```text
|EntryZone - ExitZone| <= NumberOfValidZones
```

For example, if a passenger enters in Zone 3 and attempts to exit in Zone 5 with a two-zone pass:

```text
|3 - 5| = 2
```

Since:

```text
2 <= 2
```

the exit is allowed.

---

## Timed Pass Validation

Timed Passes do not require zone-distance validation when exiting.

As long as the passenger has a valid entry and is using an active exit gate, the exit is allowed.

---

## Successful Exit

When the exit is successful:

1. A record is inserted into `PassExit`.
2. `ExitTime` is automatically recorded.
3. `TotalEnterExitCount` for the gate is increased by one.
4. The database transaction is committed.

### Response

**Status Code**

```text
200 OK
```

### Response Body

```json
{
    "success": true
}
```

---

## Failed Exit

If any required validation fails:

**Status Code**

```text
400 Bad Request
```

### Response Body

```json
{
    "success": false
}
```

---

# API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/stations/:stationId/gates` | Get all gates belonging to a station |
| `POST` | `/gates/:gateId/enter` | Process passenger entry through a gate |
| `POST` | `/gates/:gateId/exit` | Process passenger exit through a gate |

The gate registration and administration functions in `gateService` are not currently exposed through the controller and therefore are not included in the public API endpoints above.