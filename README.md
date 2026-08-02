# CPSC 304 Group 38: Urban Transit Network

## Project Summary

Our project is a public transit management database designed to manage buses, subway trains, passengers, transit passes, routes, stations, gates, and fare zones. The system stores vehicle and schedule information, verifies whether passenger transit passes are valid, and records passenger entry and exit activity at stations.

The database is designed using a normalized relational schema to reduce redundancy, maintain data consistency, and support efficient querying as the amount of transit data grows.

## Project Timeline

Our team will use an **end-to-end development approach**, where each member is responsible for both frontend and backend/database functionality for a specific part of the transit system.

The frontend will use HTML and JavaScript, while the backend will use Node.js with the `oracledb` driver to communicate directly with the department-provided Oracle database.

### Development Timeline

| Deadline | Task | Assigned Member(s) | Expected Result |
|---|---|---|---|
| **Aug 1-2** | Verify repository structure and merge Milestone 1 and Milestone 2 deliverables into the team repository | Saksham, Karn, Carina | Repository contains all previous milestone deliverables and project files |
| **Aug 3** | Finalize the database setup SQL file containing all `CREATE TABLE` statements and at least 5 valid tuples for every table | Karn | A single SQL setup file that creates and populates the complete database without errors |
| **Aug 4** | Test the complete SQL setup script on the department Oracle database and resolve foreign-key, constraint, or insertion-order problems | Karn, Saksham | Database can be created from scratch and populated successfully |
| **Aug 5** | Set up the Node.js backend and Oracle database connection using `oracledb` | Saksham | Backend successfully connects to the Oracle database |
| **Aug 6** | Create the basic GUI structure, navigation menu, page layout, forms, buttons, and result-table components | Carina | Users can navigate between major parts of the transit management system |
| **Aug 7-12th** | Implement Transport, Bus, SubwayTrain, and Route backend operations | Saksham | Backend can retrieve and modify vehicle and route information |
| **Aug 7-12th** | Build GUI forms and tables for Transport, Bus, SubwayTrain, and Route functionality | Saksham | Vehicle and route data can be viewed and managed through the GUI |
| **Aug 7-12th** | Implement Passenger, Passes, ZonePass, and TimedPass backend operations | Karn | Backend can retrieve and modify passenger and transit pass information |
| **Aug 7-12th** | Build GUI forms and tables for passenger and transit pass functionality | Karn | Passenger and pass information can be viewed and managed through the GUI |
| **Aug 7-12th** | Implement TransportStation, Gate, Zone, and RouteStop backend operations | Carina | Backend can retrieve and modify station, gate, zone, and route-stop information |
| **Aug 7-12th** | Build GUI forms and tables for station, gate, zone, and route-stop functionality | Carina | Station-related information can be viewed and managed through the GUI |
| **Aug 13** | Implement passenger entry and exit functionality using `PassEnter` and `PassExit` | Carina Karn | The system can record passengers entering and exiting stations through gates |
| **Aug 14** | Implement route/vehicle and pass/zone relationship functionality such as `RunsOn`, `ValidEntranceAt`, and `ValidExitAt` | Saksham, Karn | Relationship tables can be queried and updated correctly |
| **Aug 15** | Create GUI functionality for database insertion, deletion, and updating operations | Saksham, Karn, Carina | Users can perform database modifications through the interface rather than manually executing SQL |
| **Aug 16** | Implement project query functionality and display query results in GUI tables | Saksham, Karn, Carina | Required database queries can be executed through the application and their results are displayed clearly |
| **Aug 17** | Connect all frontend components to their corresponding backend/database operations | Saksham, Karn, Carina | Complete frontend-to-database workflow is functional |
| **Aug 18** | Add input validation and user-friendly success/error messages | Carina, Karn | Invalid input is handled safely and users receive clear feedback |
| **Aug 19** | Test primary keys, foreign keys, constraints, inserts, updates, deletes, and query results | Karn , Saksham | Database operations behave correctly and maintain data integrity |
| **Aug 20** | Full GUI and integration testing across all pages | Saksham, Karn, Carina | Navigation, forms, buttons, database operations, and result displays work together correctly |
| **Aug 21** | Fix bugs found during integration testing and improve GUI consistency | Saksham, Karn, Carina | Stable and consistent version of the application |
| **Aug 22** | Prepare realistic database tuples and demonstration scenarios | Karn, Carina | Database contains useful examples that demonstrate the main application features |
| **Aug 23** | Perform a complete project demo from database setup through frontend operations | Saksham, Karn, Carina | Team confirms that the project works from a clean database setup |
| **Aug 24** | Final code cleanup, comments, README updates, and repository organization | Saksham | Repository is organized and understandable for grading |
| **Aug 25** | Final team testing and demo rehearsal | Saksham, Karn, Carina | Every member understands the project and can explain/demo their work |
| **Aug 26** | Final backup deadline for unresolved bugs and final repository commits | Saksham, Karn, Carina | Final working version is committed and ready for submission/demo |

---

## Task Breakdown by Team Member

### Saksham

Primary responsibilities:

- Configure the Node.js backend and Oracle database connection.
- Implement Transport, Bus, SubwayTrain, and Route functionality.
- Create corresponding GUI forms and result tables.
- Implement backend endpoints/functions for retrieving and modifying vehicle and route data.
- Help integrate relationship tables such as `RunsOn`.
- Assist with database setup testing and debugging.
- Integrate frontend components with backend database operations.
- Organize the final repository and README.
- Participate in integration testing and final demo preparation.

### Karn

Primary responsibilities:

- Maintain and test the database setup SQL script.
- Implement Passenger, Passes, ZonePass, and TimedPass functionality.
- Create corresponding passenger/pass GUI forms and result tables.
- Implement passenger entry functionality.
- Assist with valid-zone and pass-related functionality.
- Test database constraints and modification operations.
- Prepare realistic data for application demonstrations.
- Participate in integration testing and final demo preparation.

### Carina

Primary responsibilities:

- Design the common GUI layout and navigation.
- Implement TransportStation, Gate, Zone, and RouteStop functionality.
- Create corresponding station/gate/zone GUI forms and result tables.
- Implement passenger exit functionality.
- Improve GUI usability and consistency.
- Add input validation and user-friendly error/success messages.
- Prepare demonstration scenarios and test data.
- Participate in integration testing and final demo preparation.
---

## GUI Development Plan

The project will use a GUI throughout rather than requiring users to execute SQL manually.

The planned interface will include:

- A navigation menu for accessing major parts of the transit system.
- Forms for adding and updating database records.
- Delete controls for removing records where appropriate.
- Tables for displaying database query results.
- Passenger and transit pass management screens.
- Vehicle and route management screens.
- Station, zone, and gate management screens.
- Passenger entry/exit functionality.
- Search/query controls for retrieving transit information.
- Success and error messages after database operations.

Every major database feature will therefore have a corresponding interface that allows the user to interact with the database through the application.

---

## Current Challenges and Remaining Work

The main remaining challenge is integrating the frontend, Node.js backend, and Oracle database so that changes made through the GUI are correctly reflected in the database.

Other areas that will require attention include:

- Ensuring the SQL setup script runs in the correct order because of foreign-key dependencies.
- Ensuring all sample tuples satisfy database constraints.
- Correctly handling invalid user input.
- Keeping frontend and backend naming consistent with the relational schema.
- Displaying query results clearly in the GUI.
- Visual representation of routs
- Coordinating code developed by different team members without introducing merge conflicts.
- Testing the complete application after all individual components have been integrated.
- Fixing other design issues that have been present since M1

The team will address these issues incrementally by first testing each feature independently and then performing full integration testing once the major frontend and backend components are connected.