-- !!New SQLs are found in the Project/db folder!!
CREATE TABLE Transport(
    VehicleID CHAR(10) NOT NULL PRIMARY KEY, 
    ManufactureYear NUMBER(4) CHECK (ManufactureYear >= 1900 AND ManufactureYear <= EXTRACT(YEAR FROM SYSDATE)), 
    Capacity INTEGER CHECK (Capacity > 0), 
    WheelchairAccessibility CHAR(1) CHECK (WheelchairAccessibility IN ('Y', 'N')))

CREATE TABLE Bus(
    VehicleID CHAR(10) NOT NULL PRIMARY KEY, 
    LisencePlate VARCHAR NOT NULL UNIQUE CHECK (LicencePlate ~ '^[A-Z0-9]{2,8}$'), 
    HomeGarage VARCHAR(50), 
    FuelType VARCHAR(25),
    FOREIGN KEY (VehicleID) REFERENCES Transport(VehicleID))

CREATE TABLE SubwayTrain(
    VehicleID CHAR(10) NOT NULL PRIMARY KEY, 
    TrainSetNumber VARCHAR(20) NOT NULL UNIQUE CHECK (TrainSetNumber ~ '^[A-Z0-9-]+$'),
    TrainModel VARCHAR(40)
    FOREIGN KEY (VehicleID) REFERENCES Transport(VehicleID)
    FOREIGN KEY (TrainModel) REFERENCES TrainModel(ModelName))

CREATE TABLE TrainModel(
    ModelName VARCHAR(40) NOT NULL PRIMARY KEY, 
    NumberOfCars INTEGER CHECK (NumberOfCars > 0))

CREATE TABLE Passenger(
    PassengerID CHAR(10) NOT NULL PRIMARY KEY, 
    FirstName VARCHAR(20), 
    LastName VARCHAR(20), 
    PassengerCategory VARCHAR(20) CHECK (PassengerCategory IN ('Adult', 'Child', 'Senior', 'Student')))

CREATE TABLE Pass(
    TicketID CHAR(10) NOT NULL PRIMARY KEY, 
    PassengerID CHAR(10) NOT NULL,
    AmountPaid NUMBER(6,2) NOT NULL, 
    TravellingStatus VARCHAR(20),
    PurchaseTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PassengerID) REFERENCES Passenger(PassengerID),
    FOREIGN KEY (TicketID) REFERENCES ZonePass(TicketID))

CREATE TABLE ZonePass(
    TicketID CHAR(10) NOT NULL PRIMARY KEY, 
    NumberOfValidZones NUMBER(2) CHECK (NumberOfValidZones > 0),
    FOREIGN KEY (TicketID) REFERENCES Pass(TicketID))

CREATE TABLE TimePass(
    TicketID CHAR(10) NOT NULL PRIMARY KEY, 
    StartTime DATE NOT NULL, 
    EndTime DATE NOT NULL, 
    PassType VARCHAR(20) CHECK (PassType IN ('Daily', 'Weekly', 'Monthly')),
    FOREIGN KEY (TicketID) REFERENCES Pass(TicketID))

CREATE TABLE Route(
    RouteID CHAR(10) NOT NULL PRIMARY KEY, 
    RouteName VARCHAR(60) NOT NULL, 
    Direction VARCHAR(20) NOT NULL, 
    RouteDescription VARCHAR(200), 
    Colour VARCHAR(20))

CREATE TABLE Schedule(
    RouteID CHAR(10) NOT NULL, 
    StartTime TIMESTAMP NOT NULL, 
    EndTime TIMESTAMP NOT NULL, 
    Frequency NUMBER(4) CHECK (Frequency > 0), 
    DayType VARCHAR(20) NOT NULL CHECK (DayType IN ('Weekday', 'Weekend', 'Holiday')),
    PRIMARY KEY (RouteID, StartTime, DayType),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID))

CREATE TABLE RouteStop(
    RouteID CHAR(10) NOT NULL, 
    StopNumber NUMBER(4) NOT NULL, 
    StationID CHAR(10) NOT NULL, 
    PRIMARY KEY (RouteID, StopNumber),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID),
    FOREIGN KEY (StationID) REFERENCES Station(StationID))

CREATE TABLE Zone(
    ZoneNumber NUMBER(3) NOT NULL PRIMARY KEY, 
    ZoneName VARCHAR(50), 
    Colour VARCHAR(20), 
    ZoneDescription VARCHAR(200))

CREATE TABLE TransportStation(
    StationID CHAR(10) NOT NULL PRIMARY KEY, 
    ZoneNumber NUMBER(3), 
    StationName VARCHAR(80), 
    Address VARCHAR(150), 
    WheelchairAccessibility CHAR(1) CHECK (WheelchairAccessibility IN ('Y', 'N')),
    FOREIGN KEY (ZoneNumber) REFERENCES Zone(ZoneNumber))

CREATE TABLE Gate (
    GateID CHAR(10) NOT NULL PRIMARY KEY, 
    StationID CHAR(10) NOT NULL, 
    ActivationStatus VARCHAR(20) CHECK (ActivationStatus IN ('Active', 'Inactive')),
    EnterOrExit VARCHAR CHECK (EnterOrExit IN ('Enter', 'Exit')),
    TotalEnterExitCount NUMBER(10) DEFAULT 0 CHECK (TotalEnterExitCount >= 0),
    FOREIGN KEY (StationID) REFERENCES TransportStation(StationID))

/*Many-to-Many Relationships*/

CREATE TABLE RunsOn(
    VehicleID CHAR(10) NOT NULL, 
    RouteID CHAR(10) NOT NULL,
    PRIMARY KEY (VehicleID, RouteID),
    FOREIGN KEY (VehicleID) REFERENCES Transport(VehicleID),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID))

CREATE TABLE ValidEntranceAt(
    TicketID CHAR(10) NOT NULL,
    ZoneNumber NUMBER(3) NOT NULL,
    PRIMARY KEY (TicketID, ZoneNumber),
    FOREIGN KEY (TicketID) REFERENCES Pass(TicketID),
    FOREIGN KEY (ZoneNumber) REFERENCES Zone(ZoneNumber)
)

CREATE TABLE ValidExitAt(
    TicketID CHAR(10) NOT NULL,
    ZoneNumber NUMBER(3) NOT NULL,
    PRIMARY KEY (TicketID, ZoneNumber),
    FOREIGN KEY (TicketID) REFERENCES Pass(TicketID),
    FOREIGN KEY (ZoneNumber) REFERENCES Zone(ZoneNumber)
)

CREATE TABLE PassEnterAt(
    TicketID CHAR(10) NOT NULL,
    ZoneNumber NUMBER(3) NOT NULL,
    PRIMARY KEY (TicketID, ZoneNumber),
    FOREIGN KEY (TicketID) REFERENCES Pass(TicketID),
    FOREIGN KEY (ZoneNumber) REFERENCES Zone(ZoneNumber)
)

CREATE TABLE PassExitAt(
    TicketID CHAR(10) NOT NULL,
    ZoneNumber NUMBER(3) NOT NULL,
    PRIMARY KEY (TicketID, ZoneNumber),
    FOREIGN KEY (TicketID) REFERENCES Pass(TicketID),
    FOREIGN KEY (ZoneNumber) REFERENCES Zone(ZoneNumber)
)