# Pass Service Function Specifications

## Overview

`passService.js` contains the business logic for managing passenger passes.

The service supports:

- Purchasing zone passes
- Purchasing timed passes
- Topping up existing timed passes
- Retrieving passes belonging to a passenger
- Maintaining pass statuses
- Removing inactive zone passes
- Marking expired timed passes as inactive

The service communicates with the Oracle database through `withOracleDB()`.

---

## 1. `purchasePassForPassenger()`

### Purpose

Purchases a new pass for a passenger.

The function determines whether the passenger wants a **Zone Pass** or a **Timed Pass** and calls the corresponding purchase function.

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `passengerId` | String | Yes | ID of the passenger purchasing the pass |
| `passType` | String | Yes | Type of pass to purchase: `"Zone"` or `"Timed"` |
| `amountPaid` | Number | Yes | Amount paid for the pass |
| `numberOfValidZones` | Number | Only for Zone | Number of zones the zone pass is valid for |
| `timedPassType` | String | Only for Timed | Type of timed pass: `"Daily"`, `"Weekly"`, or `"Monthly"` |

### Behaviour

If `passType` is `"Zone"`:

- `numberOfValidZones` must be provided.
- A new ZonePass is created.
- The function returns the newly generated ticket ID.

If `passType` is `"Timed"`:

- `timedPassType` must be provided.
- A new TimedPass is created.
- The function returns the newly generated ticket ID.

If an invalid pass type or required value is provided, the function returns:

```javascript
{
    success: false
}
```

### Successful return

```javascript
{
    success: true,
    ticketId: "T000000001"
}
```

---

## 2. `topUpTimedPass()`

### Purpose

Adds time and payment to an existing timed pass.

The function verifies that the specified ticket belongs to a timed pass before performing the top-up.

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `ticketId` | String | Yes | ID of the timed pass |
| `amountPaid` | Number | Yes | Additional amount paid |
| `passType` | String | Yes | Amount of additional time: `"Daily"`, `"Weekly"`, or `"Monthly"` |

### Behaviour

The function:

1. Checks that the ticket exists as a timed pass.
2. Retrieves its current end time.
3. Adds one day, week, or month depending on `passType`.
4. Updates the timed pass's `EndTime`.
5. Updates its `PassType`.
6. Adds the new payment to `AmountPaid`.
7. Sets the pass's travelling status to `"Active"`.
8. Commits the transaction.

If any operation fails, the transaction is rolled back.

### Successful return

```javascript
{
    success: true,
    ticketId: "T000000001"
}
```

### Failed return

```javascript
{
    success: false
}
```

---

## 3. `getPassesByPassengerId()`

### Purpose

Retrieves all passes belonging to a specific passenger.

Before retrieving the passes, the function calls `updatePassesSystem()` to ensure that expired and inactive passes are handled.

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `passengerId` | String | Yes | ID of the passenger |

### Behaviour

The function:

1. Updates the pass system.
2. Searches for passes belonging to the specified passenger.
3. Determines whether each pass is a Zone Pass or Timed Pass.
4. Returns relevant information about each pass.

### Successful return

Returns an array of pass objects:

```javascript
[
    {
        ticketId: "T000000001",
        amountPaid: 25.00,
        travellingStatus: "Active",
        purchaseTime: "...",
        passType: "Zone",
        numberOfValidZones: 2,
        startTime: null,
        endTime: null,
        timedPassType: null
    },
    {
        ticketId: "T000000002",
        amountPaid: 50.00,
        travellingStatus: "Active",
        purchaseTime: "...",
        passType: "Timed",
        numberOfValidZones: null,
        startTime: "...",
        endTime: "...",
        timedPassType: "Monthly"
    }
]
```

If an error occurs, an empty array is returned.
----

## `deletePass()`

### Purpose

Deletes a specific pass belonging to a passenger.

The function verifies that the specified pass belongs to the specified passenger before deleting it. This prevents a passenger from deleting a pass belonging to another passenger.

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `passengerId` | String | Yes | ID of the passenger who owns the pass |
| `passId` | String | Yes | ID of the pass to delete |

### Behaviour

The function:

1. Searches for the specified pass using the provided `passId`.
2. Verifies that the pass belongs to the specified `passengerId`.
3. Deletes the pass if the passenger owns it.
4. Commits the deletion.
5. Returns a successful result if the pass was deleted.

If the specified pass does not exist, does not belong to the passenger, or the database operation fails, the function returns a failed result.

### Successful return

```javascript
{
    success: true
}
```

### Failed return

```javascript
{
    success: false
}
```

A failure may occur if:

- The pass does not exist.
- The pass does not belong to the specified passenger.
- The passenger ID is invalid.
- The pass ID is invalid.
- A database error occurs.

### Database Behaviour

The deletion should only occur when both the pass ID and passenger ID match:

```sql
DELETE FROM Passes
WHERE TicketID = :passId
  AND PassengerID = :passengerId
```

This ensures that a passenger cannot delete another passenger's pass.

### Transaction Behaviour

The deletion is committed only after the database operation succeeds.

If the database operation fails, the transaction is rolled back and:

```javascript
{
    success: false
}
```

is returned.

---

# Controller Responsibilities

The `deletePass()` service function is exposed through the pass controller using:

```text
DELETE /passengers/:passengerId/passes/:passId
```

The controller:

1. Reads `passengerId` from the URL parameters.
2. Reads `passId` from the URL parameters.
3. Calls `passService.deletePass(passengerId, passId)`.
4. Returns `200 OK` if the deletion succeeds.
5. Returns `400 Bad Request` if the deletion fails.

---

# Internal Helper Functions

The following functions support the public service functions but are not directly exposed to the controller.

## `insertPass()`

### Purpose

Creates the base record in the `Passes` relation before a specific ZonePass or TimedPass record is created.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `connection` | Oracle connection | Active database connection |
| `passengerId` | String | Passenger purchasing the pass |
| `amountPaid` | Number | Amount paid |

### Return

Returns the newly generated ticket ID.

```javascript
"T000000001"
```

---

## `generateTicketID()`

### Purpose

Generates a unique ticket ID for a new pass.

The function searches for the smallest available numeric ID rather than simply using the maximum existing ID. This allows ticket IDs to be reused after passes are deleted.

### Example

If the database contains:

```text
T000000001
T000000002
T000000004
```

the next generated ID will be:

```text
T000000003
```

---

## `updatePassAmount()`

### Purpose

Updates the amount paid for an existing pass.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `ticketId` | String | ID of the pass |
| `amountPaid` | Number | New amount paid |

### Return

Returns `true` if a row was updated and `false` otherwise.

---

## `purchaseZonePass()`

### Purpose

Creates a new ZonePass.

The function first creates a record in `Passes`, then creates the corresponding record in `ZonePass`.

Both operations are committed as one transaction.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `passengerId` | String | Passenger purchasing the pass |
| `amountPaid` | Number | Amount paid |
| `numberOfValidZones` | Number | Number of valid zones |

### Return

```javascript
{
    success: true,
    ticketId: "T000000001"
}
```

---

## `purchaseTimedPass()`

### Purpose

Creates a new timed pass.

The function creates the base `Passes` record and then creates the corresponding `TimedPass` record.

The end time is calculated from the selected pass type.

### Pass durations

| Pass Type | Duration |
|---|---|
| `Daily` | 1 day |
| `Weekly` | 7 days |
| `Monthly` | 1 month |

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `passengerId` | String | Passenger purchasing the pass |
| `amountPaid` | Number | Amount paid |
| `passType` | String | Daily, Weekly, or Monthly |

---

## `getAllPasses()`

### Purpose

Retrieves all passes from the database.

This function is primarily intended for **testing and database verification** and is not exposed through the passenger-facing controller.

### Return

Returns an array containing all passes, including:

- Ticket ID
- Passenger ID
- Amount paid
- Travelling status
- Purchase time
- Pass type
- Timed pass type

---

## `updatePassesSystem()`

### Purpose

Performs pass-system maintenance.

It combines the following operations:

1. Deletes inactive zone passes.
2. Marks expired timed passes as inactive.

### Return

```javascript
{
    success: true,
    deletedZonePasses: 3,
    expiredTimedPasses: 2
}
```

If either operation fails:

```javascript
{
    success: false
}
```

This function is called internally when the system needs to synchronize pass statuses.

---

## `deleteInactiveZonePasses()`

### Purpose

Deletes ZonePass records whose corresponding pass has an `"Inactive"` travelling status.

The corresponding `Passes` record is also deleted.

Timed passes are preserved.

### Return

```javascript
{
    success: true,
    deletedCount: 3
}
```

---

## `updateExpiredTimedPasses()`

### Purpose

Automatically marks active timed passes as inactive when their end time has passed.

### Behaviour

A timed pass is considered expired when:

```text
EndTime <= CURRENT_TIMESTAMP
```

Its corresponding `Passes.TravellingStatus` is then changed from:

```text
Active
```

to:

```text
Inactive
```

### Return

```javascript
{
    success: true,
    updatedCount: 2
}
```

---

# Service API Summary

The functions exposed to other parts of the application are:

| Function | Purpose |
|---|---|
| `purchasePassForPassenger()` | Purchase a Zone or Timed Pass |
| `topUpTimedPass()` | Extend an existing timed pass |
| `getPassesByPassengerId()` | Retrieve a passenger's passes |
| `deletePass()` | delete a passenger's pass |
| `getAllPasses()` | Retrieve all passes for testing |

The following functions remain internal implementation details:

- `insertPass()`
- `generateTicketID()`
- `updatePassAmount()`
- `purchaseZonePass()`
- `purchaseTimedPass()`
- `updatePassesSystem()`
- `deleteInactiveZonePasses()`
- `updateExpiredTimedPasses()`

---

# Controller Responsibilities

The controller should only expose functions required by the frontend.

For the current pass system, the intended public operations are:

```text
POST /passengers/:passengerId/passes
POST /passes/:ticketId/top-up
GET  /passengers/:passengerId/passes
```

The controller should:

1. Read input from the HTTP request.
2. Call the appropriate service function.
3. Convert the service result into an HTTP response.

Database maintenance functions should remain inside the service layer and should not be directly accessible from the frontend.