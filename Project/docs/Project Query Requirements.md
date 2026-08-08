# Project Query Requirements

This document lists the functions that satisfy the project query requirements. Each requirement includes the implemented function and links to its corresponding **function specification** and **API specification**.

| Requirement | Function | Function Specs | API Specs |
|---|---|---|---|
| **Insert** | `insertPassenger()` | [Function Specs](specs/PassengerServiceSpecs.md#insertpassenger) | [API Specs](APIS/PassengerAPI.md#post-passengers) |
| **Select** | `getPassesByPassengerId()` | [Function Specs](specs/PassServiceSpecs.md#3-getpassesbypassengerid) | [API Specs](APIS/PassAPI.md#3-get-passengers-passes) |
| **Update** | `topUpTimedPass()` | [Function Specs](specs/PassServiceSpecs.md#2-toptuptimedpass) | [API Specs](APIS/PassAPI.md#2-top-up-a-timed-pass) |
| **Join** | `enterGate()` | [Function Specs](specs/GateServiceSpecs.md#enter-gate) | [API Specs](APIS/PassAPI.md#enter-gate) |
| **Delete** | `deletePass()` | [Function Specs](specs/PassServiceSpecs.md#deletepass) | [API Specs](APIS/PassAPI.md#4-delete-a-pass) |
| **Projection** | `getPassengerById()` | [Function Specs](specs/PassengerServiceSpecs.md#getpassengerbyid) | [API Specs](APIS/PassengerAPI.md#get-passengerspassengerid) |
| **GROUP BY** | `getAverageSpendingByPassengerCategory()` | [Function Specs](specs/StatsSpecs.md#getaveragespendingbypassengercategory) | [API Specs](APIS/StatisticsAPI.md#average-spending-by-passenger-category) |
| **HAVING** | `getGatesWithMoreThan100Events()` | [Function Specs](specs/StatsSpecs.md#getgateswithmorethan100events) | [API Specs](APIS/StatisticsAPI.md#gates-with-more-than-100-events) |
| **Nested Aggregation with GROUP BY** | `getStationsServedByMoreThanAverageRoutes()` | [Function Specs](specs/StatsSpecs.md#getstationsservedbymorethanaverageroutes) | [API Specs](APIS/StatisticsAPI.md#stations-served-by-more-than-the-average-number-of-routes) |
| **Division** | `getPassengersWithAllPassTypesCount()` | [Function Specs](specs/StatsSpecs.md#getpassengerswithallpasstypescount) | [API Specs](APIS/StatisticsAPI.md#passengers-with-all-pass-types) |

## Requirement Summary

The project query requirements are satisfied by the following database operations:

- **Insert** — Adds a new passenger to the database.
- **Select** — Retrieves all passes belonging to a specific passenger.
- **Update** — Extends an existing timed pass.
- **Join** — Retrieves information by joining data across related tables when a passenger enters a gate.
- **Delete** — Deletes a specific pass belonging to a passenger.
- **Projection** — Allows the user to select which passenger attributes are returned and in what order.
- **GROUP BY** — Calculates average spending grouped by passenger category.
- **HAVING** — Finds gates with more than 100 entrance/exit events.
- **Nested Aggregation with GROUP BY** — Finds stations served by at least the average number of routes.
- **Division** — Counts passengers who have purchased both required pass types: Zone and Timed.