-- ============================================================
-- 1. TrainModel
-- ============================================================

INSERT INTO TrainModel VALUES ('Mark I', 4);
INSERT INTO TrainModel VALUES ('Mark II', 2);
INSERT INTO TrainModel VALUES ('Mark III', 4);
INSERT INTO TrainModel VALUES ('Mark V', 6);
INSERT INTO TrainModel VALUES ('Alstom', 5);


-- ============================================================
-- 2. SubwayTrain
-- VehicleID, TrainSetNumber, ModelName, ManufactureYear,
-- Capacity, WheelchairAccessibility
-- ============================================================

INSERT INTO SubwayTrain
VALUES ('V000000001', 'TS-100', 'Mark I', 2015, 60, 'Y');

INSERT INTO SubwayTrain
VALUES ('V000000002', 'TS-101', 'Mark II', 2018, 45, 'Y');

INSERT INTO SubwayTrain
VALUES ('V000000003', 'TS-102', 'Mark III', 2010, 80, 'N');

INSERT INTO SubwayTrain
VALUES ('V000000004', 'TS-103', 'Mark V', 2021, 120, 'Y');

INSERT INTO SubwayTrain
VALUES ('V000000005', 'TS-104', 'Alstom', 2020, 100, 'Y');


-- ============================================================
-- 3. Passenger
-- 3 passengers in each category:
-- Adult, Student, Senior, Child
-- ============================================================

-- ------------------------------------------------------------
-- Adult
-- ------------------------------------------------------------

INSERT INTO Passenger
VALUES ('P000000001', 'John', 'Doe', 'Adult');

INSERT INTO Passenger
VALUES ('P000000005', 'Charlie', 'Davis', 'Adult');

INSERT INTO Passenger
VALUES ('P000000006', 'David', 'Wilson', 'Adult');


-- ------------------------------------------------------------
-- Student
-- ------------------------------------------------------------

INSERT INTO Passenger
VALUES ('P000000002', 'Jane', 'Smith', 'Student');

INSERT INTO Passenger
VALUES ('P000000007', 'Emma', 'Taylor', 'Student');

INSERT INTO Passenger
VALUES ('P000000008', 'Liam', 'Anderson', 'Student');


-- ------------------------------------------------------------
-- Senior
-- ------------------------------------------------------------

INSERT INTO Passenger
VALUES ('P000000003', 'Alice', 'Johnson', 'Senior');

INSERT INTO Passenger
VALUES ('P000000009', 'Robert', 'Martin', 'Senior');

INSERT INTO Passenger
VALUES ('P000000010', 'Susan', 'Thompson', 'Senior');


-- ------------------------------------------------------------
-- Child
-- ------------------------------------------------------------

INSERT INTO Passenger
VALUES ('P000000004', 'Bob', 'Brown', 'Child');

INSERT INTO Passenger
VALUES ('P000000011', 'Emily', 'White', 'Child');

-- ============================================================
-- 4. Passes
-- TicketID, PassengerID, AmountPaid, TravellingStatus,
-- PurchaseTime
--
-- P001: 1 pass
-- P002: 2 passes
-- P003: 3 passes
-- P004: 1 pass
-- P005: 2 passes
-- ============================================================

-- P001: 1 pass
INSERT INTO Passes
VALUES ('T000000001', 'P000000001', 105.00, 'Active', CURRENT_TIMESTAMP);


-- P002: 2 passes
INSERT INTO Passes
VALUES ('T000000002', 'P000000002', 55.00, 'Active', CURRENT_TIMESTAMP);

INSERT INTO Passes
VALUES ('T000000003', 'P000000002', 100.00, 'Active', CURRENT_TIMESTAMP);


-- P003: 5 passes
INSERT INTO Passes
VALUES ('T000000004', 'P000000003', 45.00, 'Active', CURRENT_TIMESTAMP);

INSERT INTO Passes
VALUES ('T000000005', 'P000000003', 30.00, 'Active', CURRENT_TIMESTAMP);

INSERT INTO Passes
VALUES ('T000000006', 'P000000003', 105.00, 'Active', CURRENT_TIMESTAMP);

INSERT INTO Passes
VALUES ('T000000015', 'P000000003', 105.00, 'Active', CURRENT_TIMESTAMP);

INSERT INTO Passes
VALUES ('T000000016', 'P000000003', 105.00, 'Active', CURRENT_TIMESTAMP);



-- P004: 1 pass
INSERT INTO Passes
VALUES ('T000000007', 'P000000004', 30.00, 'Active', CURRENT_TIMESTAMP);


-- P005: 2 passes
INSERT INTO Passes
VALUES ('T000000008', 'P000000005', 55.00, 'Active', CURRENT_TIMESTAMP);

INSERT INTO Passes
VALUES ('T000000009', 'P000000005', 100.00, 'Active', CURRENT_TIMESTAMP);

-- 1 passes:

INSERT INTO Passes 
VALUES ('T000000010', 'P000000006', 55.00, 'Active', CURRENT_TIMESTAMP);

INSERT INTO Passes 
VALUES ('T000000011', 'P000000007', 30.00, 'Active', CURRENT_TIMESTAMP);

INSERT INTO Passes 
VALUES ('T000000012', 'P000000008', 105.00, 'Active', CURRENT_TIMESTAMP);

INSERT INTO Passes 
VALUES ('T000000013', 'P000000009', 55.00, 'Active', CURRENT_TIMESTAMP);

INSERT INTO Passes 
VALUES ('T000000014', 'P000000010', 45.00, 'Active', CURRENT_TIMESTAMP);

-- ============================================================
-- 5. ZonePass
--
-- Each TicketID appears in ZonePass OR TimedPass,
-- but never both.
-- ============================================================

-- T001: P001
INSERT INTO ZonePass
VALUES ('T000000001', 3);

-- T002: P002
INSERT INTO ZonePass
VALUES ('T000000002', 1);

-- T004: P003
INSERT INTO ZonePass
VALUES ('T000000004', 2);

-- T005: P003
INSERT INTO ZonePass
VALUES ('T000000005', 1);

-- T007: P004
INSERT INTO ZonePass
VALUES ('T000000007', 2);

-- T009: P005
INSERT INTO ZonePass
VALUES ('T000000009', 3);

INSERT INTO ZonePass 
VALUES ('T000000010', 1);

INSERT INTO ZonePass 
VALUES ('T000000012', 3);

INSERT INTO ZonePass 
VALUES ('T000000014', 2);

-- ============================================================
-- 6. TimedPass
--
-- T003, T006, and T008 are TimedPasses.
-- None of these TicketIDs appear in ZonePass.
-- ============================================================

-- T003: P002
INSERT INTO TimedPass
VALUES (
    'T000000003',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '7' DAY,
    'Weekly'
);

-- T006: P003
INSERT INTO TimedPass
VALUES (
    'T000000006',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '1' MONTH,
    'Monthly'
);

-- T008: P005
INSERT INTO TimedPass
VALUES (
    'T000000008',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '1' DAY,
    'Daily'
);

INSERT INTO TimedPass 
VALUES ( 'T000000011', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1' DAY, 'Daily' );

INSERT INTO TimedPass 
VALUES ( 'T000000013', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7' DAY, 'Weekly' );

INSERT INTO TimedPass 
VALUES ( 'T000000015', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1' DAY, 'Daily' );

INSERT INTO TimedPass 
VALUES ( 'T000000016', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7' DAY, 'Weekly' );

-- ============================================================
-- 7. Route
-- RouteID, RouteNumber, RouteName, RouteDescription, Colour
-- ============================================================

INSERT INTO Route
VALUES ('R000000001', 99, '99 B-Line', 'Express to UBC', 'Orange');

INSERT INTO Route
VALUES ('R000000002', 1, 'Expo Line', 'Downtown to Surrey', 'Blue');

INSERT INTO Route
VALUES ('R000000003', 2, 'Canada Line', 'Richmond to Downtown', 'Light Blue');

INSERT INTO Route
VALUES ('R000000004', 3, 'Millennium', 'VCC to Lafarge', 'Yellow');

INSERT INTO Route
VALUES ('R000000005', 49, '49', 'Metrotown to UBC', 'Red');


-- ============================================================
-- 8. Schedule
-- RouteID, StartTime, DayType, EndTime, Frequency
-- Frequency is in minutes.
-- Every route has a Weekday, Weekend, and Holiday schedule.
-- ============================================================


-- ------------------------------------------------------------
-- R001: 99 B-Line
-- ------------------------------------------------------------

INSERT INTO Schedule
VALUES ('R000000001', '06:00', 'Weekday', '23:00', 5);

INSERT INTO Schedule
VALUES ('R000000001', '07:00', 'Weekend', '22:00', 10);

INSERT INTO Schedule
VALUES ('R000000001', '08:00', 'Holiday', '21:00', 15);


-- ------------------------------------------------------------
-- R002: Expo Line
-- ------------------------------------------------------------

INSERT INTO Schedule
VALUES ('R000000002', '05:00', 'Weekday', '01:00', 3);

INSERT INTO Schedule
VALUES ('R000000002', '06:00', 'Weekend', '01:00', 5);

INSERT INTO Schedule
VALUES ('R000000002', '07:00', 'Holiday', '00:00', 8);


-- ------------------------------------------------------------
-- R003: Canada Line
-- ------------------------------------------------------------

INSERT INTO Schedule
VALUES ('R000000003', '05:30', 'Weekday', '00:30', 5);

INSERT INTO Schedule
VALUES ('R000000003', '06:00', 'Weekend', '00:30', 7);

INSERT INTO Schedule
VALUES ('R000000003', '07:00', 'Holiday', '23:30', 10);


-- ------------------------------------------------------------
-- R004: Millennium Line
-- ------------------------------------------------------------

INSERT INTO Schedule
VALUES ('R000000004', '05:30', 'Weekday', '00:30', 4);

INSERT INTO Schedule
VALUES ('R000000004', '06:30', 'Weekend', '00:30', 7);

INSERT INTO Schedule
VALUES ('R000000004', '07:00', 'Holiday', '23:00', 10);


-- ------------------------------------------------------------
-- R005: 49
-- ------------------------------------------------------------

INSERT INTO Schedule
VALUES ('R000000005', '05:00', 'Weekday', '23:30', 10);

INSERT INTO Schedule
VALUES ('R000000005', '07:00', 'Weekend', '23:00', 15);

INSERT INTO Schedule
VALUES ('R000000005', '08:00', 'Holiday', '22:00', 20);


-- ============================================================
-- 9. Zone
-- ============================================================

INSERT INTO Zone
VALUES (1, 'Vancouver', 'Green', 'Central Hub');

INSERT INTO Zone
VALUES (2, 'Burnaby/Richmond', 'Yellow', 'Inner Suburbs');

INSERT INTO Zone
VALUES (3, 'Surrey/Langley', 'Red', 'Outer Suburbs');

INSERT INTO Zone
VALUES (4, 'North Shore', 'Blue', 'Mountains');

INSERT INTO Zone
VALUES (5, 'Delta', 'Orange', 'South of Fraser');


-- ============================================================
-- 10. TransportStation
-- ============================================================

INSERT INTO TransportStation
VALUES ('S000000001', 1, 'Waterfront', '601 W Cordova St', 'Y');

INSERT INTO TransportStation
VALUES ('S000000002', 2, 'Metrotown', '6300 Central Blvd', 'Y');

INSERT INTO TransportStation
VALUES ('S000000003', 3, 'Surrey Central', '10275 City Pkwy', 'N');

INSERT INTO TransportStation
VALUES ('S000000004', 1, 'UBC Exchange', '6131 Student Union Blvd', 'Y');

INSERT INTO TransportStation
VALUES ('S000000005', 2, 'Richmond-Brighouse', '6971 No 3 Rd', 'Y');

INSERT INTO TransportStation
VALUES ('S000000006', 1, 'Commercial-Broadway', '1701 E Broadway', 'Y');

INSERT INTO TransportStation
VALUES ('S000000007', 1, 'Joyce-Collingwood', '5094 Joyce St', 'Y');

INSERT INTO TransportStation
VALUES ('S000000008', 1, 'Marine Drive', '8575 Cambie St', 'Y');

INSERT INTO TransportStation
VALUES ('S000000009', 1, 'VCC-Clark', '115 W 1st St', 'Y');

INSERT INTO TransportStation
VALUES ('S000000010', 2, 'Lougheed Town Centre', '9855 Austin Rd', 'Y');

INSERT INTO TransportStation
VALUES ('S000000011', 1, 'Langara-49th', '535 W 49th Ave', 'Y');


-- ============================================================
-- 11. RouteStop
-- RouteID, StopNumber, StationID
-- Each route has at least 3 stops.
-- ============================================================

-- R000000001: 99 B-Line
INSERT INTO RouteStop
VALUES ('R000000001', 1, 'S000000004');

INSERT INTO RouteStop
VALUES ('R000000001', 2, 'S000000006');

INSERT INTO RouteStop
VALUES ('R000000001', 3, 'S000000007');


-- R000000002: Expo Line
INSERT INTO RouteStop
VALUES ('R000000002', 1, 'S000000001');

INSERT INTO RouteStop
VALUES ('R000000002', 2, 'S000000006');

INSERT INTO RouteStop
VALUES ('R000000002', 3, 'S000000003');


-- R000000003: Canada Line
INSERT INTO RouteStop
VALUES ('R000000003', 1, 'S000000005');

INSERT INTO RouteStop
VALUES ('R000000003', 2, 'S000000008');

INSERT INTO RouteStop
VALUES ('R000000003', 3, 'S000000001');


-- R000000004: Millennium Line
INSERT INTO RouteStop
VALUES ('R000000004', 1, 'S000000009');

INSERT INTO RouteStop
VALUES ('R000000004', 2, 'S000000006');

INSERT INTO RouteStop
VALUES ('R000000004', 3, 'S000000010');


-- R000000005: 49
INSERT INTO RouteStop
VALUES ('R000000005', 1, 'S000000002');

INSERT INTO RouteStop
VALUES ('R000000005', 2, 'S000000011');

INSERT INTO RouteStop
VALUES ('R000000005', 3, 'S000000004');


-- ============================================================
-- 12. Gate
-- Each station has:
--   - 1 Active Enter gate
--   - 1 Active Exit gate
--   - 1 Inactive gate
-- ============================================================


-- ============================================================
-- S001: Waterfront
-- ============================================================

INSERT INTO Gate
VALUES ('G000000001', 'S000000001', 'Active', 'Enter', 15);

INSERT INTO Gate
VALUES ('G000000002', 'S000000001', 'Active', 'Exit', 145);

INSERT INTO Gate
VALUES ('G000000003', 'S000000001', 'Inactive', 'Enter', 50);


-- ============================================================
-- S002: Metrotown
-- ============================================================

INSERT INTO Gate
VALUES ('G000000004', 'S000000002', 'Active', 'Enter', 80);

INSERT INTO Gate
VALUES ('G000000005', 'S000000002', 'Active', 'Exit', 78);

INSERT INTO Gate
VALUES ('G000000006', 'S000000002', 'Inactive', 'Exit', 32);


-- ============================================================
-- S003: Surrey Central
-- ============================================================

INSERT INTO Gate
VALUES ('G000000007', 'S000000003', 'Active', 'Enter', 120);

INSERT INTO Gate
VALUES ('G000000008', 'S000000003', 'Active', 'Exit', 115);

INSERT INTO Gate
VALUES ('G000000009', 'S000000003', 'Inactive', 'Enter', 45);


-- ============================================================
-- S004: UBC Exchange
-- ============================================================

INSERT INTO Gate
VALUES ('G000000010', 'S000000004', 'Active', 'Enter', 500);

INSERT INTO Gate
VALUES ('G000000011', 'S000000004', 'Active', 'Exit', 480);

INSERT INTO Gate
VALUES ('G000000012', 'S000000004', 'Inactive', 'Exit', 180);


-- ============================================================
-- S005: Richmond-Brighouse
-- ============================================================

INSERT INTO Gate
VALUES ('G000000013', 'S000000005', 'Active', 'Enter', 65);

INSERT INTO Gate
VALUES ('G000000014', 'S000000005', 'Active', 'Exit', 62);

INSERT INTO Gate
VALUES ('G000000015', 'S000000005', 'Inactive', 'Enter', 21);


-- ============================================================
-- S006: Commercial-Broadway
-- ============================================================

INSERT INTO Gate
VALUES ('G000000016', 'S000000006', 'Active', 'Enter', 110);

INSERT INTO Gate
VALUES ('G000000017', 'S000000006', 'Active', 'Exit', 105);

INSERT INTO Gate
VALUES ('G000000018', 'S000000006', 'Inactive', 'Exit', 40);


-- ============================================================
-- S007: Joyce-Collingwood
-- ============================================================

INSERT INTO Gate
VALUES ('G000000019', 'S000000007', 'Active', 'Enter', 70);

INSERT INTO Gate
VALUES ('G000000020', 'S000000007', 'Active', 'Exit', 68);

INSERT INTO Gate
VALUES ('G000000021', 'S000000007', 'Inactive', 'Enter', 25);


-- ============================================================
-- S008: Marine Drive
-- ============================================================

INSERT INTO Gate
VALUES ('G000000022', 'S000000008', 'Active', 'Enter', 45);

INSERT INTO Gate
VALUES ('G000000023', 'S000000008', 'Active', 'Exit', 43);

INSERT INTO Gate
VALUES ('G000000024', 'S000000008', 'Inactive', 'Exit', 15);


-- ============================================================
-- S009: VCC-Clark
-- ============================================================

INSERT INTO Gate
VALUES ('G000000025', 'S000000009', 'Active', 'Enter', 35);

INSERT INTO Gate
VALUES ('G000000026', 'S000000009', 'Active', 'Exit', 33);

INSERT INTO Gate
VALUES ('G000000027', 'S000000009', 'Inactive', 'Enter', 90);


-- ============================================================
-- S010: Lougheed Town Centre
-- ============================================================

INSERT INTO Gate
VALUES ('G000000028', 'S000000010', 'Active', 'Enter', 60);

INSERT INTO Gate
VALUES ('G000000029', 'S000000010', 'Active', 'Exit', 58);

INSERT INTO Gate
VALUES ('G000000030', 'S000000010', 'Inactive', 'Exit', 19);


-- ============================================================
-- S011: Langara-49th
-- ============================================================

INSERT INTO Gate
VALUES ('G000000031', 'S000000011', 'Active', 'Enter', 40);

INSERT INTO Gate
VALUES ('G000000032', 'S000000011', 'Active', 'Exit', 38);

INSERT INTO Gate
VALUES ('G000000033', 'S000000011', 'Inactive', 'Enter', 12);





-- ============================================================
-- 13. RunsOn
-- ============================================================

INSERT INTO RunsOn
VALUES ('V000000001', 'R000000001');

INSERT INTO RunsOn
VALUES ('V000000002', 'R000000002');

INSERT INTO RunsOn
VALUES ('V000000003', 'R000000003');

INSERT INTO RunsOn
VALUES ('V000000004', 'R000000004');

INSERT INTO RunsOn
VALUES ('V000000005', 'R000000005');


-- ============================================================
-- 14. PassEnter
-- TicketID, GateID, EntryTime
-- ============================================================

INSERT INTO PassEnter
VALUES ('T000000001', 'G000000001', CURRENT_TIMESTAMP);

INSERT INTO PassEnter
VALUES ('T000000002', 'G000000003', CURRENT_TIMESTAMP);

INSERT INTO PassEnter
VALUES ('T000000003', 'G000000005', CURRENT_TIMESTAMP);

INSERT INTO PassEnter
VALUES ('T000000004', 'G000000001', CURRENT_TIMESTAMP);

INSERT INTO PassEnter
VALUES ('T000000005', 'G000000003', CURRENT_TIMESTAMP);


-- ============================================================
-- 15. PassExit
-- TicketID, GateID, ExitTime
-- ============================================================

INSERT INTO PassExit
VALUES ('T000000001', 'G000000002', CURRENT_TIMESTAMP);

INSERT INTO PassExit
VALUES ('T000000002', 'G000000004', CURRENT_TIMESTAMP);

INSERT INTO PassExit
VALUES ('T000000003', 'G000000002', CURRENT_TIMESTAMP);

INSERT INTO PassExit
VALUES ('T000000004', 'G000000004', CURRENT_TIMESTAMP);

INSERT INTO PassExit
VALUES ('T000000005', 'G000000002', CURRENT_TIMESTAMP);

