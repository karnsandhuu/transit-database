-- !!New SQLs are found in the Project/db folder!!
-- 1. Transport
CREATE TABLE Transport (
    VehicleID CHAR(10) PRIMARY KEY,
    ManufactureYear NUMBER(4) NOT NULL CHECK (ManufactureYear >= 1900),
    Capacity NUMBER(4) NOT NULL CHECK (Capacity > 0),
    WheelchairAccessibility CHAR(1) NOT NULL CHECK (WheelchairAccessibility IN ('Y', 'N'))
);

-- 2. Bus
CREATE TABLE Bus (
    VehicleID CHAR(10) PRIMARY KEY,
    LicencePlate VARCHAR2(10) UNIQUE NOT NULL,
    HomeGarage VARCHAR2(60),
    FuelType VARCHAR2(25),

    FOREIGN KEY (VehicleID)
        REFERENCES Transport(VehicleID),

    CHECK (REGEXP_LIKE(LicencePlate, '^[A-Z0-9]{2,10}$'))
);

-- 3. TrainModelInfo
CREATE TABLE TrainModelInfo (
    TrainModel VARCHAR2(40) PRIMARY KEY,
    NumberOfCars NUMBER(2) NOT NULL CHECK (NumberOfCars > 0)
);

-- 4. SubwayTrain
CREATE TABLE SubwayTrain (
    VehicleID CHAR(10) PRIMARY KEY,
    TrainSetNumber VARCHAR2(20) UNIQUE NOT NULL,
    TrainModel VARCHAR2(40) NOT NULL,

    FOREIGN KEY (VehicleID)
        REFERENCES Transport(VehicleID),

    FOREIGN KEY (TrainModel)
        REFERENCES TrainModelInfo(TrainModel),

    CHECK (REGEXP_LIKE(TrainSetNumber, '^[A-Z0-9-]+$'))
);

-- 5. Passenger
CREATE TABLE Passenger (
    PassengerID CHAR(10) PRIMARY KEY,
    FirstName VARCHAR2(20) NOT NULL,
    LastName VARCHAR2(20) NOT NULL,
    PassengerCategory VARCHAR2(20) NOT NULL CHECK (PassengerCategory IN ('Adult', 'Child', 'Senior', 'Student'))
);

-- 6. Passes
CREATE TABLE Passes (
    TicketID CHAR(10) PRIMARY KEY,
    PassengerID CHAR(10) NOT NULL,
    TravellingStatus VARCHAR2(20) NOT NULL CHECK (TravellingStatus IN ('Active', 'Inactive', 'Expired', 'Suspended')),
    AmountPaid NUMBER(8,2) NOT NULL CHECK (AmountPaid >= 0),
    PurchaseTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (PassengerID) REFERENCES Passenger(PassengerID)
);

-- 7. ZonePass
CREATE TABLE ZonePass (
    TicketID CHAR(10) PRIMARY KEY,
    NumberOfValidZones NUMBER(2) NOT NULL CHECK (NumberOfValidZones > 0),
    FOREIGN KEY (TicketID) REFERENCES Passes(TicketID)
);

-- 8. TimedPass
CREATE TABLE TimedPass (
    TicketID CHAR(10) PRIMARY KEY,
    StartTime TIMESTAMP NOT NULL,
    EndTime TIMESTAMP NOT NULL,
    PassType VARCHAR2(20) NOT NULL CHECK (PassType IN ('Daily', 'Weekly', 'Monthly')),
    FOREIGN KEY (TicketID) REFERENCES Passes(TicketID),
    CONSTRAINT chk_timedpass_time CHECK (EndTime > StartTime)
);

-- 9. Route
CREATE TABLE Route (
    RouteID CHAR(10) PRIMARY KEY,
    RouteName VARCHAR2(60) NOT NULL,
    Direction VARCHAR2(20) NOT NULL,
    RouteDescription VARCHAR2(200),
    Colour VARCHAR2(20)
);

-- 10. Schedule
CREATE TABLE Schedule (
    RouteID CHAR(10),
    StartTime TIMESTAMP,
    DayType VARCHAR2(20) CHECK (DayType IN ('Weekday', 'Weekend', 'Holiday')),
    EndTime TIMESTAMP NOT NULL,
    Frequency NUMBER(4) NOT NULL CHECK (Frequency > 0),
    PRIMARY KEY (RouteID, StartTime, DayType),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID),
    CONSTRAINT chk_schedule_time CHECK (EndTime > StartTime)
);

-- 11. Zone
CREATE TABLE Zone (
    ZoneNumber NUMBER(3) PRIMARY KEY CHECK (ZoneNumber > 0),
    ZoneName VARCHAR2(50) NOT NULL,
    Colour VARCHAR2(20),
    ZoneDescription VARCHAR2(200)
);

-- 12. TransportStation
CREATE TABLE TransportStation (
    StationID CHAR(10) PRIMARY KEY,
    ZoneNumber NUMBER(3) NOT NULL,
    StationName VARCHAR2(80) NOT NULL,
    Address VARCHAR2(150) NOT NULL,
    WheelchairAccessibility CHAR(1) NOT NULL CHECK (WheelchairAccessibility IN ('Y', 'N')),
    FOREIGN KEY (ZoneNumber) REFERENCES Zone(ZoneNumber)
);

-- 13. RouteStop
CREATE TABLE RouteStop (
    RouteID CHAR(10),
    StopNumber NUMBER(4) CHECK (StopNumber > 0),
    StationID CHAR(10) NOT NULL,
    PRIMARY KEY (RouteID, StopNumber),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID),
    FOREIGN KEY (StationID) REFERENCES TransportStation(StationID)
);

-- 14. Gate
CREATE TABLE Gate (
    GateID CHAR(10) PRIMARY KEY,
    StationID CHAR(10) NOT NULL,
    ActivationStatus VARCHAR2(20) NOT NULL CHECK (ActivationStatus IN ('Active', 'Inactive')),
    EnterOrExit VARCHAR2(10) NOT NULL CHECK (EnterOrExit IN ('Enter', 'Exit')),
    TotalEnterExitCount NUMBER(10) DEFAULT 0 NOT NULL CHECK (TotalEnterExitCount >= 0),
    FOREIGN KEY (StationID) REFERENCES TransportStation(StationID)
);

-- 15. RunsOn
CREATE TABLE RunsOn (
    VehicleID CHAR(10),
    RouteID CHAR(10),
    PRIMARY KEY (VehicleID, RouteID),
    FOREIGN KEY (VehicleID) REFERENCES Transport(VehicleID),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID)
);

-- 16. ValidEntranceAt
CREATE TABLE ValidEntranceAt (
    TicketID CHAR(10),
    ZoneNumber NUMBER(3),
    PRIMARY KEY (TicketID, ZoneNumber),
    FOREIGN KEY (TicketID) REFERENCES ZonePass(TicketID),
    FOREIGN KEY (ZoneNumber) REFERENCES Zone(ZoneNumber)
);

-- 17. ValidExitAt
CREATE TABLE ValidExitAt (
    TicketID CHAR(10),
    ZoneNumber NUMBER(3),
    PRIMARY KEY (TicketID, ZoneNumber),
    FOREIGN KEY (TicketID) REFERENCES ZonePass(TicketID),
    FOREIGN KEY (ZoneNumber) REFERENCES Zone(ZoneNumber)
);

-- 18. PassEnter
CREATE TABLE PassEnter (
    TicketID CHAR(10),
    GateID CHAR(10),
    EntryTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (TicketID, GateID, EntryTime),
    FOREIGN KEY (TicketID) REFERENCES Passes(TicketID),
    FOREIGN KEY (GateID) REFERENCES Gate(GateID)
);

-- 19. PassExit
CREATE TABLE PassExit (
    TicketID CHAR(10),
    GateID CHAR(10),
    ExitTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (TicketID, GateID, ExitTime),
    FOREIGN KEY (TicketID) REFERENCES Passes(TicketID),
    FOREIGN KEY (GateID) REFERENCES Gate(GateID)
);
