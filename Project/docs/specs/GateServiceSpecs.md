# Gate Service Function Specifications

The `gateService` provides functions for retrieving gates associated with stations and for processing passenger entry and exit through gates.

The service is responsible for enforcing gate and pass validation rules before recording successful entry or exit transactions.

---

## Get Gates by Station

### Function

```javascript
getGatesByStation(stationId)
```

### Purpose

Retrieves all gates belonging to a specific transport station.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `stationId` | `string` | The ID of the station whose gates should be retrieved. |

### Returns

Returns an array of gate objects.

```javascript
[
    {
        gateId,
        stationId,
        activationStatus,
        enterOrExit,
        totalEnterExitCount
    }
]
```

If an error occurs, an empty array is returned.

### Example

```javascript
const gates = await gateService.getGatesByStation(
    "S000000001"
);
```

---

# Enter Gate

### Function

```javascript
enterGate(ticketId, gateId)
```

### Purpose

Processes a passenger attempting to enter the transit system through a gate.

The function verifies that:

1. The pass exists.
2. The gate exists.
3. The pass is active.
4. The gate is active.
5. The gate allows entry.
6. The successful entry is recorded in `PassEnter`.
7. The gate's `TotalEnterExitCount` is incremented.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `ticketId` | `string` | The ticket ID of the pass being used. |
| `gateId` | `string` | The ID of the gate being used. |

### Validation

The pass must have:

```text
TravellingStatus = "Active"
```

The gate must have:

```text
ActivationStatus = "Active"
EnterOrExit = "Enter"
```

If any validation fails, the entry is rejected.

### Successful Entry

A successful entry creates a record in:

```text
PassEnter
```

containing:

```text
TicketID
GateID
EntryTime
```

The gate's usage count is then incremented:

```text
TotalEnterExitCount = TotalEnterExitCount + 1
```

The entry record and counter update are committed as one transaction.

### Returns

Successful entry:

```javascript
{
    success: true
}
```

Failed entry:

```javascript
{
    success: false
}
```

### Example

```javascript
const result = await gateService.enterGate(
    "T000000001",
    "G000000001"
);
```

---

# Exit Gate

### Function

```javascript
exitGate(ticketId, gateId)
```

### Purpose

Processes a passenger attempting to exit the transit system through a gate.

The function verifies that:

1. The gate exists.
2. The gate is active.
3. The gate allows exit.
4. The passenger has a valid previous entry.
5. The pass exists.
6. Zone passes are within their permitted zone distance.
7. Timed passes are allowed to exit without additional zone validation.
8. The successful exit is recorded in `PassExit`.
9. The gate's `TotalEnterExitCount` is incremented.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `ticketId` | `string` | The ticket ID of the pass being used. |
| `gateId` | `string` | The ID of the exit gate being used. |

### Gate Validation

The exit gate must have:

```text
ActivationStatus = "Active"
EnterOrExit = "Exit"
```

If either condition is not satisfied, the exit is rejected.

### Entry Validation

The passenger must have a previous entry that has not already been followed by an exit.

The most recent valid entry is used to determine the station zone where the passenger entered.

### Zone Pass Validation

For a Zone Pass, the entry station's zone and exit station's zone are compared.

The zone distance is calculated as:

```text
|EntryZone - ExitZone|
```

The exit is allowed when:

```text
|EntryZone - ExitZone| <= NumberOfValidZones
```

For example, if:

```text
Entry Zone = 3
Exit Zone = 5
NumberOfValidZones = 2
```

then:

```text
|3 - 5| = 2
```

Therefore, the exit is allowed.

If:

```text
Entry Zone = 1
Exit Zone = 5
NumberOfValidZones = 2
```

then:

```text
|1 - 5| = 4
```

Therefore, the exit is rejected.

### Timed Pass Validation

Timed passes do not require zone-distance validation when exiting.

Once a valid entry has been established and the exit gate is valid, the passenger can exit.

### Successful Exit

A successful exit creates a record in:

```text
PassExit
```

containing:

```text
TicketID
GateID
ExitTime
```

The gate's usage count is then incremented:

```text
TotalEnterExitCount = TotalEnterExitCount + 1
```

The exit record and counter update are committed as one transaction.

### Returns

Successful exit:

```javascript
{
    success: true
}
```

Failed exit:

```javascript
{
    success: false
}
```

### Example

```javascript
const result = await gateService.exitGate(
    "T000000001",
    "G000000002"
);
```

---

# Internal Helper Functions

The following functions are used internally by `gateService` and are not exported.

## Get Exit Gate Information

### Function

```javascript
getExitGateInfo(connection, gateId)
```

### Purpose

Retrieves the activation status, entrance/exit type, and zone number associated with an exit gate.

### Returns

```javascript
{
    activationStatus,
    enterOrExit,
    zoneNumber
}
```

Returns `null` if the gate does not exist.

---

## Get Latest Entry

### Function

```javascript
getLatestEntry(connection, ticketId)
```

### Purpose

Retrieves the most recent entry for a pass that occurred after its most recent exit.

This ensures that a passenger cannot exit using an old entry from a previous trip.

### Returns

```javascript
{
    entryTime,
    zoneNumber
}
```

Returns `null` if there is no valid outstanding entry.

---

## Get Pass Information

### Function

```javascript
getPassInfo(connection, ticketId)
```

### Purpose

Determines the type of pass associated with a ticket and retrieves the number of valid zones for a Zone Pass.

### Returns

```javascript
{
    passType,
    numberOfValidZones
}
```

The possible pass types are:

```text
Zone
Timed
```

Returns `null` if the pass does not exist.

---

## Validate Zone Pass Exit

### Function

```javascript
validateZonePassExit(
    entryZone,
    exitZone,
    numberOfValidZones
)
```

### Purpose

Determines whether a Zone Pass can exit at the specified station.

### Logic

```text
zoneDistance = |entryZone - exitZone|
```

The exit is valid when:

```text
zoneDistance <= numberOfValidZones
```

### Returns

```javascript
true
```

if the exit is allowed.

```javascript
false
```

if the exit is not allowed.

### Example

```javascript
const valid = validateZonePassExit(
    3,
    5,
    2
);
```

Result:

```javascript
true
```

---

## Record Exit

### Function

```javascript
recordExit(connection, ticketId, gateId)
```

### Purpose

Records a successful passenger exit and increments the gate usage counter.

### Operations

The function performs two database operations:

1. Inserts a record into `PassExit`.
2. Increments `Gate.TotalEnterExitCount`.

Both operations are part of the same transaction managed by `exitGate()`.

---

# Exported Functions

The service exports the following functions:

```javascript
module.exports = {
    insertGate,
    getGateById,
    getGatesByStation,
    updateGate,
    enterGate,
    exitGate
};
```

The client-facing gate operations currently used by the controller are:

```text
getGatesByStation()
enterGate()
exitGate()
```

The remaining exported functions support gate registration and administration.