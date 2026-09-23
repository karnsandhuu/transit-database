# Transit Management Database

A relational database application designed to manage and analyze a subway transit system.

The system manages passengers, transit passes, subway trains, routes, stations, schedules, fare zones, and station gate activity. It supports common transit operations such as purchasing passes, managing passenger information, recording station entry and exit activity, and generating statistics from transit data.

## Features

- Manage passenger information
- Purchase and manage transit passes
- Track subway trains and their assigned routes
- Store station, route, and schedule information
- Manage fare zones
- Record passenger entry and exit activity at station gates
- Search and retrieve passenger and pass information
- Generate transit statistics and analytics
- Validate relationships between passengers, passes, stations, and routes

## Database Functionality

The application implements a variety of relational database operations, including:

- **Insert** — purchase a new transit pass for a passenger
- **Select** — retrieve passes belonging to a passenger
- **Update** — modify passenger information
- **Delete** — remove a passenger's transit pass
- **Join** — combine related transit data across tables
- **Projection** — retrieve selected passenger attributes
- **GROUP BY** — analyze average spending by passenger category
- **HAVING** — identify stations with high entrance or exit activity
- **Nested Aggregation** — find stations served by an above-average number of routes
- **Relational Division** — identify passengers who have purchased every required pass type

## Database Design

The database contains 15 related tables representing the transit system, including:

- `Passenger`
- `Passes`
- `ZonePass`
- `TimedPass`
- `SubwayTrain`
- `TrainModel`
- `Route`
- `Schedule`
- `Zone`
- `TransportStation`
- `RouteStop`
- `Gate`
- `RunsOn`
- `PassEnter`
- `PassExit`

The schema uses primary keys, foreign keys, constraints, and relationships to maintain data consistency across the system.

## Tech Stack

- **SQL**
- **Oracle Database**
- **JavaScript**
- **Relational Database Design**
- **REST API**
- **Git / GitHub**

## Example Analytics

The system can answer questions such as:

- What is the average amount spent by each passenger category?
- Which stations have the highest entrance or exit activity?
- Which stations are served by at least the average number of routes?
- Which passengers have purchased every available type of transit pass?

These queries use SQL concepts such as joins, grouping, aggregation, nested queries, `HAVING`, and relational division.

## Project Structure

The application separates database operations into service modules for different parts of the transit system, including:

- Passenger management
- Pass management
- Gate operations
- Transit statistics

API and function documentation are also included within the repository.

## What I Learned

Through this project, I gained experience with:

- Designing relational database schemas
- Writing complex SQL queries
- Working with primary and foreign key relationships
- Implementing CRUD operations
- Using joins and aggregate queries
- Working with Oracle SQL
- Connecting application logic to a relational database
- Designing and documenting API functionality
- Collaborating on a larger software project

## Future Improvements

Some improvements I would consider include:

- Adding more advanced transit analytics
- Improving the user interface
- Adding route and station visualization
- Expanding passenger and fare reporting
- Improving error handling and input validation
- Adding additional automated testing
