# Route API

## Get Route by Route Number

### Endpoint

```text
GET /route/:routeNumber
```

### Purpose

Retrieves information about a specific route using its route number.

The route number is assigned by the client when the route is created and must be unique.

---

## Request

### Method

```text
GET
```

### URL Parameters

| Parameter | Type | Description |
|---|---|---|
| `routeNumber` | Number | The unique route number to retrieve. |

### Example

```text
GET /route/25
```

---

## Response

### Success — `200 OK`

Returns the route information.

Example:

```json
{
    "routeId": "R000000001",
    "routeNumber": 25,
    "routeName": "Downtown Line",
    "routeDescription": "Route connecting downtown stations",
    "colour": "Blue"
}
```

### Not Found — `404 Not Found`

Returned when no route with the specified route number exists.

```json
{
    "success": false
}
```

---

# Get Schedules by Route Number

### Endpoint

```text
GET /route/:routeNumber/schedules
```

### Purpose

Retrieves all schedules associated with a specific route.

A route can have multiple schedules. Each schedule specifies the operating period, day type, and frequency of the route.

---

## Request

### Method

```text
GET
```

### URL Parameters

| Parameter | Type | Description |
|---|---|---|
| `routeNumber` | Number | The route number whose schedules should be retrieved. |

### Example

```text
GET /route/25/schedules
```

---

## Response

### Success — `200 OK`

Returns an array containing the schedules for the route.

Example:

```json
[
    {
        "startTime": "06:00",
        "dayType": "Weekday",
        "endTime": "23:00",
        "frequency": 10
    },
    {
        "startTime": "07:00",
        "dayType": "Weekend",
        "endTime": "22:00",
        "frequency": 15
    }
]
```

If the route exists but has no schedules, an empty array is returned.

```json
[]
```

---

# Get Route Stops by Route Number

### Endpoint

```text
GET /route/:routeNumber/stops
```

### Purpose

Retrieves all stations belonging to a specific route in their route sequence.

The route stops are ordered according to their `StopNumber`.

The returned result does **not** expose the internal `RouteID`.

The stop numbers returned by the API are normalized to the sequence of the returned stations. For example, if the database contains:

```text
StopNumber  Station
1           S000000001
3           S000000003
4           S000000005
```

the API returns:

```text
StopNumber  Station
1           S000000001
2           S000000003
3           S000000005
```

This allows the client to treat the returned stops as a continuous sequence.

---

## Request

### Method

```text
GET
```

### URL Parameters

| Parameter | Type | Description |
|---|---|---|
| `routeNumber` | Number | The route number whose stops should be retrieved. |

### Example

```text
GET /route/25/stops
```

---

## Response

### Success — `200 OK`

Returns the stations on the route in sequence.

Example:

```json
[
    {
        "stopNumber": 1,
        "stationId": "S000000001",
        "stationName": "Main Street"
    },
    {
        "stopNumber": 2,
        "stationId": "S000000003",
        "stationName": "Central Station"
    },
    {
        "stopNumber": 3,
        "stationId": "S000000005",
        "stationName": "University"
    }
]
```

If the route has no route stops, an empty array is returned.

```json
[]
```

---

# API Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/route/:routeNumber` | Get a route by route number |
| `GET` | `/route/:routeNumber/schedules` | Get all schedules for a route |
| `GET` | `/route/:routeNumber/stops` | Get all route stops in sequence |

---

# Error Handling

The Route API uses the following general response for unsuccessful route lookups:

```json
{
    "success": false
}
```

For `GET /route/:routeNumber`, a nonexistent route returns:

```text
404 Not Found
```

For schedule and route-stop queries, the service returns an empty array when no matching records are found.