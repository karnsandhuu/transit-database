# Statistics Service Function Specifications

## `getAverageSpendingByPassengerCategory()`

### Purpose

Retrieves spending statistics grouped by passenger category.

The function calculates:

- The number of unique passengers in each passenger category.
- The average amount paid across all passes purchased by passengers in that category.

This function implements the **Aggregation with `GROUP BY`** requirement.

### Parameters

None.

### Example

```javascript
const statistics =
    await getAverageSpendingByPassengerCategory();
```

### Return Value

Returns an array of objects, with one object for each passenger category.

Example:

```javascript
[
    {
        passengerCategory: "Adult",
        passengerCount: 25,
        averageAmountSpent: 18.50
    },
    {
        passengerCategory: "Student",
        passengerCount: 12,
        averageAmountSpent: 10.75
    }
]
```

If no passengers have purchased passes:

```javascript
[]
```

If a database error occurs:

```javascript
[]
```

### Notes

The query uses:

```sql
GROUP BY p.PassengerCategory
```

to group passengers by category.

`COUNT(DISTINCT p.PassengerID)` is used so that a passenger who has purchased multiple passes is counted only once in `passengerCount`.

`AVG(pa.AmountPaid)` calculates the average amount paid per pass for that category.

---

## `getGatesWithMoreThan100Events()`

### Purpose

Retrieves all gates that have recorded more than 100 entrance or exit events.

This function implements the **Aggregation with `HAVING`** requirement.

### Parameters

None.

### Example

```javascript
const gates =
    await getGatesWithMoreThan100Events();
```

### Return Value

Returns an array containing gates whose `TotalEnterExitCount` is greater than 100.

Example:

```javascript
[
    {
        gateId: "G000000001",
        stationId: "S000000001",
        enterOrExit: "Enter",
        totalEnterExitCount: 250
    },
    {
        gateId: "G000000005",
        stationId: "S000000003",
        enterOrExit: "Exit",
        totalEnterExitCount: 175
    }
]
```

If no gates have more than 100 events:

```javascript
[]
```

If a database error occurs:

```javascript
[]
```

### Notes

The query uses:

```sql
GROUP BY
    GateID,
    StationID,
    EnterOrExit,
    TotalEnterExitCount
```

and filters the groups using:

```sql
HAVING TotalEnterExitCount > 100
```

The results are ordered by `TotalEnterExitCount` in descending order.

---

## `getStationsServedByMoreThanAverageRoutes()`

### Purpose

Retrieves stations that are served by at least the average number of distinct routes across all stations.

This function implements the **Nested Aggregation with `GROUP BY`** requirement.

### Parameters

None.

### Example

```javascript
const stations =
    await getStationsServedByMoreThanAverageRoutes();
```

### Return Value

Returns an array of station objects.

Example:

```javascript
[
    {
        stationId: "S000000003",
        stationName: "Central Station",
        routeCount: 5
    },
    {
        stationId: "S000000007",
        stationName: "Main Street",
        routeCount: 4
    }
]
```

If no stations satisfy the condition:

```javascript
[]
```

If a database error occurs:

```javascript
[]
```

### Notes

The inner query calculates the number of distinct routes serving each station:

```sql
SELECT
    COUNT(DISTINCT RouteID) AS route_count
FROM RouteStop
GROUP BY StationID
```

The outer query then calculates the average of these route counts:

```sql
SELECT AVG(route_count)
FROM (...)
```

The outer `GROUP BY` groups route stops by station, while the `HAVING` clause compares each station's route count against the calculated average.

The results are ordered by `RouteCount` in descending order.

---

## `getPassengersWithAllPassTypesCount()`

### Purpose

Counts the number of passengers who have purchased **all pass types currently offered by the system**.

The current pass types are:

- Zone
- Timed

This function implements the **Division** requirement.

### Parameters

None.

### Example

```javascript
const passengerCount =
    await getPassengersWithAllPassTypesCount();
```

### Return Value

Returns a single integer representing the number of passengers who have purchased at least one pass of every required pass type.

Example:

```javascript
8
```

If no passengers have purchased all pass types:

```javascript
0
```

If a database error occurs:

```javascript
0
```

### Notes

The function implements relational division using nested `NOT EXISTS` clauses.

Conceptually, for each passenger, the query asks:

> Does this passenger have every required pass type?

The required pass types are represented by:

```sql
SELECT 'Zone' AS PassType
FROM dual

UNION

SELECT 'Timed' AS PassType
FROM dual
```

A passenger must have at least one Zone pass and at least one Timed pass to be counted.

For example:

| Passenger | Zone Pass | Timed Pass | Included |
|---|---:|---:|---:|
| P000000001 | Yes | Yes | Yes |
| P000000002 | Yes | No | No |
| P000000003 | No | Yes | No |
| P000000004 | Yes | Yes | Yes |

The function returns the number of passengers satisfying the division condition rather than returning the individual passenger records.

---

# Function Summary

| Function | Requirement | Return Type |
|---|---|---|
| `getAverageSpendingByPassengerCategory()` | Aggregation with `GROUP BY` | Array of objects |
| `getGatesWithMoreThan100Events()` | Aggregation with `HAVING` | Array of objects |
| `getStationsServedByMoreThanAverageRoutes()` | Nested aggregation with `GROUP BY` | Array of objects |
| `getPassengersWithAllPassTypesCount()` | Division | Number |