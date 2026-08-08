# Statistics API

## Average Spending by Passenger Category

### Endpoint

```text
GET /statistics/average-spending-by-category
```

### Purpose

Retrieves statistics about passenger spending grouped by passenger category.

The query calculates:

- The number of passengers in each category.
- The average amount paid per pass for each passenger category.

The results are grouped by `PassengerCategory`.

### Request

No parameters are required.

### Example Request

```text
GET /statistics/average-spending-by-category
```

### Successful Response

**Status:** `200 OK`

```json
[
    {
        "passengerCategory": "Adult",
        "passengerCount": 25,
        "averageAmountSpent": 18.50
    },
    {
        "passengerCategory": "Student",
        "passengerCount": 12,
        "averageAmountSpent": 10.75
    }
]
```

### Notes

A passenger may have purchased multiple passes. Therefore, `passengerCount` uses `COUNT(DISTINCT PassengerID)` so that each passenger is counted only once within their category.

`averageAmountSpent` is the average `AmountPaid` across passes purchased by passengers in that category.

---

## Gates with More Than 100 Events

### Endpoint

```text
GET /statistics/gates-more-than-100-events
```

### Purpose

Retrieves gates that have recorded more than 100 entrance or exit events.

The query uses aggregation with a `HAVING` clause to filter gates based on their `TotalEnterExitCount`.

### Request

No parameters are required.

### Example Request

```text
GET /statistics/gates-more-than-100-events
```

### Successful Response

**Status:** `200 OK`

```json
[
    {
        "gateId": "G000000001",
        "stationId": "S000000001",
        "enterOrExit": "Enter",
        "totalEnterExitCount": 250
    },
    {
        "gateId": "G000000005",
        "stationId": "S000000003",
        "enterOrExit": "Exit",
        "totalEnterExitCount": 175
    }
]
```

### Notes

Only gates where `TotalEnterExitCount > 100` are returned.

The results are ordered from the gate with the highest number of events to the lowest.

---

## Stations Served by More Than the Average Number of Routes

### Endpoint

```text
GET /statistics/stations-more-than-average-routes
```

### Purpose

Retrieves stations that are served by at least the average number of routes across all stations.

The query first calculates the number of distinct routes serving each station. It then calculates the average route count across all stations and returns stations whose route count is greater than or equal to that average.

This query demonstrates **nested aggregation with `GROUP BY`**.

### Request

No parameters are required.

### Example Request

```text
GET /statistics/stations-more-than-average-routes
```

### Successful Response

**Status:** `200 OK`

```json
[
    {
        "stationId": "S000000003",
        "stationName": "Central Station",
        "routeCount": 5
    },
    {
        "stationId": "S000000007",
        "stationName": "Main Street",
        "routeCount": 4
    }
]
```

### Notes

`RouteCount` represents the number of distinct routes that serve the station.

The query uses:

```sql
COUNT(DISTINCT RouteID)
```

to avoid counting the same route multiple times for a station.

The results are ordered by `RouteCount` in descending order.

---

## Passengers with All Pass Types

### Endpoint

```text
GET /statistics/passengers-with-all-pass-types
```

### Purpose

Counts the number of passengers who have purchased **every pass type offered by the system**.

Currently, the system supports two pass types:

- Zone
- Timed

Therefore, a passenger is included only if they have purchased at least one Zone pass and at least one Timed pass.

This query demonstrates **relational division**.

### Request

No parameters are required.

### Example Request

```text
GET /statistics/passengers-with-all-pass-types
```

### Successful Response

**Status:** `200 OK`

```json
{
    "passengerCount": 8
}
```

### Notes

The SQL query implements relational division using nested `NOT EXISTS` clauses.

Conceptually, the query asks:

> Which passengers have every required pass type?

A passenger who has only a Zone pass is not included.

A passenger who has only a Timed pass is not included.

A passenger who has both Zone and Timed passes is included.

The result is a count rather than a list of individual passengers.

---

# Statistics Endpoint Summary

| Method | Endpoint | Query Requirement |
|---|---|---|
| `GET` | `/statistics/average-spending-by-category` | Aggregation with `GROUP BY` |
| `GET` | `/statistics/gates-more-than-100-events` | Aggregation with `HAVING` |
| `GET` | `/statistics/stations-more-than-average-routes` | Nested aggregation with `GROUP BY` |
| `GET` | `/statistics/passengers-with-all-pass-types` | Division |