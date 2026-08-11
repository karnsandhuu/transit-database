# Project Query Requirements

This document lists the functions that satisfy the project query requirements. Each requirement includes the implemented function and links to its corresponding **function specification** and **API specification**.

| Requirement | Function | Code | Function Specs | API Specs |
|---|---|---|---|
| **Insert** | `insertPassenger()` | services/passengerService.js line: 5 | [Function Specs](specs/PassengerServiceSpecs.md#insertpassenger) | [API Specs](APIS/PassengerAPI.md#post-passengers) |
| **Select** | `getPassesByPassengerId()` | services/passService.js line: 453 | [Function Specs](specs/PassServiceSpecs.md#3-getpassesbypassengerid) | [API Specs](APIS/PassAPI.md#3-get-passengers-passes) |
| **Update** | `topUpTimedPass()` | services/passengerService.js line: 234 | [Function Specs](specs/PassServiceSpecs.md#2-toptuptimedpass) | [API Specs](APIS/PassAPI.md#2-top-up-a-timed-pass) |
| **Join** | `enterGate()` | services/gateService.js line: 201| [Function Specs](specs/GateServiceSpecs.md#enter-gate) | [API Specs](APIS/PassAPI.md#enter-gate) |
| **Delete** | `deletePass()` | services/passService.js line: 511| [Function Specs](specs/PassServiceSpecs.md#deletepass) | [API Specs](APIS/PassAPI.md#4-delete-a-pass) |
| **Projection** | `getPassengerById()` | services/passengerService.js line: 60| [Function Specs](specs/PassengerServiceSpecs.md#getpassengerbyid) | [API Specs](APIS/PassengerAPI.md#get-passengerspassengerid) |
| **GROUP BY** | `getAverageSpendingByPassengerCategory()` | services/statsService.js line: 4 | [Function Specs](specs/StatsSpecs.md#getaveragespendingbypassengercategory) | [API Specs](APIS/StatisticsAPI.md#average-spending-by-passenger-category) |
| **HAVING** | `getGatesWithMoreThan100Events()` | services/statsService.js line: 35 | [Function Specs](specs/StatsSpecs.md#getgateswithmorethan100events) | [API Specs](APIS/StatisticsAPI.md#gates-with-more-than-100-events) |
| **Nested Aggregation with GROUP BY** | services/statsService.js line: 77 |`getStationsServedByMoreThanAverageRoutes()` | [Function Specs](specs/StatsSpecs.md#getstationsservedbymorethanaverageroutes) | [API Specs](APIS/StatisticsAPI.md#stations-served-by-more-than-the-average-number-of-routes) |
| **Division** | `getPassengersWithAllPassTypesCount()` | services/statsService.js line: 129 |[Function Specs](specs/StatsSpecs.md#getpassengerswithallpasstypescount) | [API Specs](APIS/StatisticsAPI.md#passengers-with-all-pass-types) |

## Requirement Summary

The project query requirements are satisfied by the following database operations:

### 1-6:
- **Insert** — Adds a new passenger to the database.
- **Select** — Retrieves all passes belonging to a specific passenger.
- **Update** — Extends an existing timed pass.
- **Join** — Retrieves information by joining data across related tables when a passenger enters a gate.
- **Delete** — Deletes a specific pass belonging to a passenger.
- **Projection** — Allows the user to select which passenger attributes are returned and in what order.

### 7-10:
- **GROUP BY** — Calculates average spending grouped by passenger category.

```
SELECT
    p.PassengerCategory,
    COUNT(DISTINCT p.PassengerID) AS PassengerCount,
    AVG(pa.AmountPaid) AS AverageAmountSpent
FROM Passenger p
JOIN Passes pa
    ON p.PassengerID = pa.PassengerID
GROUP BY
    p.PassengerCategory
ORDER BY
    p.PassengerCategory

```
The query groups passengers by PassengerCategory and calculates the number of unique passengers by ID and their average pass spending within each category. The results are then sorted alphabetically by passenger category.

- **HAVING** — Finds gates with more than 100 entrance/exit events.

```
SELECT
    GateID,
    StationID,
    EnterOrExit,
    TotalEnterExitCount
FROM Gate
GROUP BY
    GateID,
    StationID,
    EnterOrExit,
    TotalEnterExitCount
HAVING
    TotalEnterExitCount > 100
ORDER BY
    TotalEnterExitCount DESC
```

The query finds gates that have recorded more than 100 entrances or exits. It groups the results by gate and station, then displays the qualifying gates in descending order of event count.

- **Nested Aggregation with GROUP BY** — Finds stations served by at least the average number of routes.

```
SELECT
    s.StationID,
    s.StationName,
    COUNT(DISTINCT rs.RouteID) AS RouteCount
FROM TransportStation s
LEFT JOIN RouteStop rs
    ON s.StationID = rs.StationID
GROUP BY
    s.StationID,
    s.StationName
HAVING COUNT(DISTINCT rs.RouteID) >= (
    SELECT AVG(route_count)
    FROM (
SELECT
    s2.StationID,
    COUNT(DISTINCT rs2.RouteID) AS route_count
FROM TransportStation s2
LEFT JOIN RouteStop rs2
    ON s2.StationID = rs2.StationID
GROUP BY s2.StationID
    )
)
ORDER BY
    RouteCount DESC
```
The query finds stations served by at least the average number of distinct routes across all stations. It groups stations by their route count, compares each count to the overall average using a nested aggregation, drops the group of stations if it has a lower route count, and orders the results from highest to lowest route count.

- **Division** — Counts passengers who have purchased both required pass types: Zone and Timed.

```
SELECT COUNT(*) AS PassengerCount
FROM Passenger p
WHERE NOT EXISTS (
    SELECT 1
    FROM (
        SELECT 'Zone' AS PassType
        FROM dual

        UNION

        SELECT 'Timed' AS PassType
        FROM dual
    ) requiredTypes
    WHERE NOT EXISTS (
        SELECT 1
        FROM Passes pa
        LEFT JOIN ZonePass zp
            ON pa.TicketID = zp.TicketID
        LEFT JOIN TimedPass tp
            ON pa.TicketID = tp.TicketID
        WHERE pa.PassengerID = p.PassengerID
        AND (
            (
                requiredTypes.PassType = 'Zone'
                AND zp.TicketID IS NOT NULL
            )
            OR
            (
                requiredTypes.PassType = 'Timed'
                AND tp.TicketID IS NOT NULL
            )
        )
    )
)
```

The query counts passengers who have purchased both a Zone pass and a Timed pass. It uses nested NOT EXISTS conditions to implement division, ensuring that each passenger has both a zone pass and a timed pass.
