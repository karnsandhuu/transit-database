# Pass API Specification

## Overview

The Pass API provides the frontend with operations for purchasing passes, topping up timed passes, and viewing the passes belonging to a passenger.

The API communicates with the pass service through the pass controller.

### Base URL

```text
/
```

---

## 1. Purchase a Pass

### Endpoint

```http
POST /passengers/:passengerId/passes
```

### Purpose

Allows a passenger to purchase a new pass.

The passenger can choose between:

- A Zone Pass
- A Timed Pass

The required information depends on the selected pass type.

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `passengerId` | String | ID of the passenger purchasing the pass |

### Request Body

For a **Zone Pass**:

```json
{
    "passType": "Zone",
    "amountPaid": 10.00,
    "numberOfValidZones": 2
}
```

For a **Timed Pass**:

```json
{
    "passType": "Timed",
    "amountPaid": 50.00,
    "timedPassType": "Monthly"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `passType` | String | Yes | `"Zone"` or `"Timed"` |
| `amountPaid` | Number | Yes | Amount paid for the pass |
| `numberOfValidZones` | Number | Zone only | Number of zones the pass is valid for |
| `timedPassType` | String | Timed only | `"Daily"`, `"Weekly"`, or `"Monthly"` |

Fields that are not relevant to the selected pass type may be omitted.

### Successful Response

**Status:** `201 Created`

```json
{
    "success": true,
    "ticketId": "T000000001"
}
```

The server generates the `ticketId`; the client does not provide it.

### Failed Response

**Status:** `400 Bad Request`

```json
{
    "success": false
}
```

Possible causes include:

- Invalid pass type
- Missing required pass information
- Invalid timed pass type
- Invalid number of zones
- Invalid passenger ID
- Database constraint violation

---

# 2. Top Up a Timed Pass

### Endpoint

```http
POST /passes/:ticketId/top-up
```

### Purpose

Extends an existing timed pass.

The passenger can choose to add:

- One day
- One week
- One month

The additional payment is added to the existing `AmountPaid`.

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `ticketId` | String | ID of the timed pass to top up |

### Request Body

```json
{
    "amountPaid": 20.00,
    "passType": "Weekly"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `amountPaid` | Number | Yes | Additional amount paid |
| `passType` | String | Yes | `"Daily"`, `"Weekly"`, or `"Monthly"` |

### Behaviour

When a top-up is successful:

1. The existing timed pass is found.
2. Its `EndTime` is extended.
3. Its `PassType` is updated.
4. The additional amount is added to `AmountPaid`.
5. Its travelling status is changed to `"Active"`.

### Successful Response

**Status:** `200 OK`

```json
{
    "success": true,
    "ticketId": "T000000001"
}
```

### Failed Response

**Status:** `400 Bad Request`

```json
{
    "success": false
}
```

This may occur if:

- The ticket does not exist.
- The ticket is not a timed pass.
- An invalid pass type is provided.
- The database operation fails.

---

# 3. Get Passenger's Passes

### Endpoint

```http
GET /passengers/:passengerId/passes
```

### Purpose

Returns all passes belonging to a specific passenger.

Before retrieving the passes, the service updates the pass system by:

- Marking expired timed passes as inactive.
- Removing inactive zone passes.

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `passengerId` | String | ID of the passenger |

### Request Body

None.

### Successful Response

**Status:** `200 OK`

```json
[
    {
        "ticketId": "T000000001",
        "amountPaid": 10.00,
        "travellingStatus": "Active",
        "purchaseTime": "2026-08-07T10:30:00",
        "passType": "Zone",
        "numberOfValidZones": 2,
        "startTime": null,
        "endTime": null,
        "timedPassType": null
    },
    {
        "ticketId": "T000000002",
        "amountPaid": 50.00,
        "travellingStatus": "Active",
        "purchaseTime": "2026-08-06T14:20:00",
        "passType": "Timed",
        "numberOfValidZones": null,
        "startTime": "2026-08-06T14:20:00",
        "endTime": "2026-09-06T14:20:00",
        "timedPassType": "Monthly"
    }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `ticketId` | String | Unique pass ID |
| `amountPaid` | Number | Total amount paid for the pass |
| `travellingStatus` | String | Current status of the pass |
| `purchaseTime` | Timestamp | Time the pass was purchased |
| `passType` | String | `"Zone"` or `"Timed"` |
| `numberOfValidZones` | Number / null | Number of valid zones for a Zone Pass |
| `startTime` | Timestamp / null | Start time for a Timed Pass |
| `endTime` | Timestamp / null | Expiration time for a Timed Pass |
| `timedPassType` | String / null | `"Daily"`, `"Weekly"`, or `"Monthly"` |

Fields that do not apply to the type of pass are returned as `null`.

### Failed Response

If an error occurs while retrieving the passenger's passes, the service currently returns an empty array:

```json
[]
```

---

# API Design Notes

## Ticket IDs

The client does not generate or provide ticket IDs when purchasing a pass.

The server generates the ticket ID and returns it after a successful purchase.

Example:

```text
Client
   │
   │ POST /passengers/P000000001/passes
   │
   ▼
Controller
   │
   ▼
Pass Service
   │
   ├── Generate Ticket ID
   ├── Create Passes record
   └── Create ZonePass/TimedPass record
   │
   ▼
Client receives
{
    "success": true,
    "ticketId": "T000000001"
}
```

## Pass Type

The client specifies the type of pass using `passType`.

```text
Zone
```

or

```text
Timed
```

The additional fields are conditional:

```text
Zone
 └── numberOfValidZones

Timed
 └── timedPassType
```

This prevents the frontend from having to provide irrelevant information.

## Internal Functions

The following service functions are not exposed as API endpoints:

- `insertPass()`
- `generateTicketID()`
- `updatePassAmount()`
- `purchaseZonePass()`
- `purchaseTimedPass()`
- `updatePassesSystem()`
- `deleteInactiveZonePasses()`
- `updateExpiredTimedPasses()`

They are internal implementation details of the pass service.

## Testing Function

`getAllPasses()` is retained in the service for testing and database verification but is **not exposed through the production API**.

Therefore, there is intentionally no:

```http
GET /passes
```

endpoint for the frontend.