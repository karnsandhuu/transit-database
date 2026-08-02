-- 1. Transport
INSERT INTO Transport VALUES ('V001', 2015, 60, 'Y');
INSERT INTO Transport VALUES ('V002', 2018, 45, 'Y');
INSERT INTO Transport VALUES ('V003', 2010, 80, 'N');
INSERT INTO Transport VALUES ('V004', 2021, 120, 'Y');
INSERT INTO Transport VALUES ('V005', 2020, 100, 'Y');

-- 2. Bus
INSERT INTO Bus VALUES ('V001', 'AB123C', 'North Garage', 'Diesel');
INSERT INTO Bus VALUES ('V002', 'XY987Z', 'South Garage', 'Electric');
INSERT INTO Bus VALUES ('V003', 'BC456D', 'East Garage', 'Hybrid');
INSERT INTO Bus VALUES ('V004', 'MN345P', 'West Garage', 'Electric');
INSERT INTO Bus VALUES ('V005', 'PQ765R', 'North Garage', 'Diesel');

-- 3. TrainModelInfo
INSERT INTO TrainModelInfo VALUES ('Mark I', 4);
INSERT INTO TrainModelInfo VALUES ('Mark II', 2);
INSERT INTO TrainModelInfo VALUES ('Mark III', 4);
INSERT INTO TrainModelInfo VALUES ('Mark V', 6);
INSERT INTO TrainModelInfo VALUES ('Alstom', 5);

-- 4. SubwayTrain
INSERT INTO SubwayTrain VALUES ('V001', 'TS-100', 'Mark I');
INSERT INTO SubwayTrain VALUES ('V002', 'TS-101', 'Mark II');
INSERT INTO SubwayTrain VALUES ('V003', 'TS-102', 'Mark III');
INSERT INTO SubwayTrain VALUES ('V004', 'TS-103', 'Mark V');
INSERT INTO SubwayTrain VALUES ('V005', 'TS-104', 'Alstom');

-- 5. Passenger
INSERT INTO Passenger VALUES ('P001', 'John', 'Doe', 'Adult');
INSERT INTO Passenger VALUES ('P002', 'Jane', 'Smith', 'Student');
INSERT INTO Passenger VALUES ('P003', 'Alice', 'Johnson', 'Senior');
INSERT INTO Passenger VALUES ('P004', 'Bob', 'Brown', 'Child');
INSERT INTO Passenger VALUES ('P005', 'Charlie', 'Davis', 'Adult');

-- 6. Passes
INSERT INTO Passes VALUES ('T001', 'P001', 'Active', 105.00, CURRENT_TIMESTAMP);
INSERT INTO Passes VALUES ('T002', 'P002', 'Active', 55.00, CURRENT_TIMESTAMP);
INSERT INTO Passes VALUES ('T003', 'P003', 'Expired', 45.00, CURRENT_TIMESTAMP);
INSERT INTO Passes VALUES ('T004', 'P004', 'Active', 30.00, CURRENT_TIMESTAMP);
INSERT INTO Passes VALUES ('T005', 'P005', 'Inactive', 0.00, CURRENT_TIMESTAMP);

-- 7. ZonePass
INSERT INTO ZonePass VALUES ('T001', 3);
INSERT INTO ZonePass VALUES ('T002', 1);
INSERT INTO ZonePass VALUES ('T003', 2);
INSERT INTO ZonePass VALUES ('T004', 1);
INSERT INTO ZonePass VALUES ('T005', 2);

-- 8. TimedPass
INSERT INTO TimedPass VALUES ('T001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1' MONTH, 'Monthly');
INSERT INTO TimedPass VALUES ('T002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7' DAY, 'Weekly');
INSERT INTO TimedPass VALUES ('T003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1' DAY, 'Daily');
INSERT INTO TimedPass VALUES ('T004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1' MONTH, 'Monthly');
INSERT INTO TimedPass VALUES ('T005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7' DAY, 'Weekly');

-- 9. Route
INSERT INTO Route VALUES ('R001', '99 B-Line', 'Eastbound', 'Express to UBC', 'Orange');
INSERT INTO Route VALUES ('R002', 'Expo Line', 'Westbound', 'Downtown to Surrey', 'Blue');
INSERT INTO Route VALUES ('R003', 'Canada Line', 'Northbound', 'Richmond to Downtown', 'Light Blue');
INSERT INTO Route VALUES ('R004', 'Millennium', 'Eastbound', 'VCC to Lafarge', 'Yellow');
INSERT INTO Route VALUES ('R005', '49', 'Westbound', 'Metrotown to UBC', 'Red');

-- 10. Schedule
INSERT INTO Schedule VALUES ('R001', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), 'Weekday', TO_TIMESTAMP('22:00:00', 'HH24:MI:SS'), 5);
INSERT INTO Schedule VALUES ('R002', TO_TIMESTAMP('06:00:00', 'HH24:MI:SS'), 'Weekday', TO_TIMESTAMP('01:00:00', 'HH24:MI:SS'), 3);
INSERT INTO Schedule VALUES ('R003', TO_TIMESTAMP('07:00:00', 'HH24:MI:SS'), 'Weekend', TO_TIMESTAMP('23:00:00', 'HH24:MI:SS'), 10);
INSERT INTO Schedule VALUES ('R004', TO_TIMESTAMP('09:00:00', 'HH24:MI:SS'), 'Holiday', TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 15);
INSERT INTO Schedule VALUES ('R005', TO_TIMESTAMP('05:30:00', 'HH24:MI:SS'), 'Weekday', TO_TIMESTAMP('23:30:00', 'HH24:MI:SS'), 10);

-- 11. Zone
INSERT INTO Zone VALUES (1, 'Vancouver', 'Green', 'Central Hub');
INSERT INTO Zone VALUES (2, 'Burnaby/Richmond', 'Yellow', 'Inner Suburbs');
INSERT INTO Zone VALUES (3, 'Surrey/Langley', 'Red', 'Outer Suburbs');
INSERT INTO Zone VALUES (4, 'North Shore', 'Blue', 'Mountains');
INSERT INTO Zone VALUES (5, 'Delta', 'Orange', 'South of Fraser');

-- 12. TransportStation
INSERT INTO TransportStation VALUES ('S001', 1, 'Waterfront', '601 W Cordova St', 'Y');
INSERT INTO TransportStation VALUES ('S002', 2, 'Metrotown', '6300 Central Blvd', 'Y');
INSERT INTO TransportStation VALUES ('S003', 3, 'Surrey Central', '10275 City Pkwy', 'Y');
INSERT INTO TransportStation VALUES ('S004', 1, 'UBC Exchange', '6131 Student Union Blvd', 'Y');
INSERT INTO TransportStation VALUES ('S005', 2, 'Richmond-Brighouse', '6971 No 3 Rd', 'Y');

-- 13. RouteStop
INSERT INTO RouteStop VALUES ('R001', 1, 'S004');
INSERT INTO RouteStop VALUES ('R002', 1, 'S001');
INSERT INTO RouteStop VALUES ('R002', 15, 'S003');
INSERT INTO RouteStop VALUES ('R003', 1, 'S005');
INSERT INTO RouteStop VALUES ('R005', 1, 'S002');

-- 14. Gate
INSERT INTO Gate VALUES ('G001', 'S001', 'Active', 'Enter', 15000);
INSERT INTO Gate VALUES ('G002', 'S001', 'Active', 'Exit', 14500);
INSERT INTO Gate VALUES ('G003', 'S002', 'Active', 'Enter', 8000);
INSERT INTO Gate VALUES ('G004', 'S003', 'Inactive', 'Exit', 200);
INSERT INTO Gate VALUES ('G005', 'S004', 'Active', 'Enter', 5000);

-- 15. RunsOn
INSERT INTO RunsOn VALUES ('V001', 'R001');
INSERT INTO RunsOn VALUES ('V002', 'R002');
INSERT INTO RunsOn VALUES ('V003', 'R003');
INSERT INTO RunsOn VALUES ('V004', 'R004');
INSERT INTO RunsOn VALUES ('V005', 'R005');

-- 16. ValidEntranceAt
INSERT INTO ValidEntranceAt VALUES ('T001', 1);
INSERT INTO ValidEntranceAt VALUES ('T002', 2);
INSERT INTO ValidEntranceAt VALUES ('T003', 1);
INSERT INTO ValidEntranceAt VALUES ('T004', 3);
INSERT INTO ValidEntranceAt VALUES ('T005', 2);

-- 17. ValidExitAt
INSERT INTO ValidExitAt VALUES ('T001', 1);
INSERT INTO ValidExitAt VALUES ('T002', 2);
INSERT INTO ValidExitAt VALUES ('T003', 1);
INSERT INTO ValidExitAt VALUES ('T004', 3);
INSERT INTO ValidExitAt VALUES ('T005', 2);

-- 18. PassEnter
INSERT INTO PassEnter VALUES ('T001', 'G001', CURRENT_TIMESTAMP);
INSERT INTO PassEnter VALUES ('T002', 'G003', CURRENT_TIMESTAMP);
INSERT INTO PassEnter VALUES ('T003', 'G005', CURRENT_TIMESTAMP);
INSERT INTO PassEnter VALUES ('T004', 'G001', CURRENT_TIMESTAMP);
INSERT INTO PassEnter VALUES ('T005', 'G003', CURRENT_TIMESTAMP);

-- 19. PassExit
INSERT INTO PassExit VALUES ('T001', 'G002', CURRENT_TIMESTAMP);
INSERT INTO PassExit VALUES ('T002', 'G004', CURRENT_TIMESTAMP);
INSERT INTO PassExit VALUES ('T003', 'G002', CURRENT_TIMESTAMP);
INSERT INTO PassExit VALUES ('T004', 'G004', CURRENT_TIMESTAMP);
INSERT INTO PassExit VALUES ('T005', 'G002', CURRENT_TIMESTAMP);