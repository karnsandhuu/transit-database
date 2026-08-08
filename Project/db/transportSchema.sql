CREATE TABLE Transport (
    VehicleID                  VARCHAR2(10)    NOT NULL,
    ManufactureYear            NUMBER(4)   NOT NULL,
    Capacity                   NUMBER(4)   NOT NULL,
    WheelchairAccessibility    CHAR(1)     NOT NULL,

    CONSTRAINT PK_Transport
        PRIMARY KEY (VehicleID),

    CONSTRAINT CHK_Transport_Year
        CHECK (ManufactureYear >= 1900),

    CONSTRAINT CHK_Transport_Capacity
        CHECK (Capacity > 0),

    CONSTRAINT CHK_Transport_Wheelchair
        CHECK (WheelchairAccessibility IN ('Y', 'N'))
);

CREATE TABLE TrainModel (
    ModelName       VARCHAR2(40)    NOT NULL,
    NumberOfCars    NUMBER(2)       NOT NULL,

    CONSTRAINT PK_TrainModel
        PRIMARY KEY (ModelName),

    CONSTRAINT CHK_TrainModel_NumberOfCars
        CHECK (NumberOfCars > 0)
);

CREATE TABLE Bus (
    VehicleID       VARCHAR2(10)        NOT NULL,
    LicencePlate    VARCHAR2(10)    NOT NULL,
    HomeGarage      VARCHAR2(60),
    FuelType        VARCHAR2(25),

    CONSTRAINT PK_Bus
        PRIMARY KEY (VehicleID),

    CONSTRAINT UQ_Bus_LicencePlate
        UNIQUE (LicencePlate),

    CONSTRAINT FK_Bus_Transport
        FOREIGN KEY (VehicleID)
        REFERENCES Transport(VehicleID),

    CONSTRAINT CHK_Bus_LicencePlate
        CHECK (
            REGEXP_LIKE(
                LicencePlate,
                '^[A-Z0-9]{2,10}$'
            )
        )
);

CREATE TABLE SubwayTrain (
    VehicleID        VARCHAR2(10)    NOT NULL,
    TrainSetNumber   VARCHAR2(20)    NOT NULL,
    ModelName        VARCHAR2(40)    NOT NULL,

    CONSTRAINT PK_SubwayTrain
        PRIMARY KEY (VehicleID),

    CONSTRAINT UQ_SubwayTrain_TrainSetNumber
        UNIQUE (TrainSetNumber),

    CONSTRAINT FK_SubwayTrain_Transport
        FOREIGN KEY (VehicleID)
        REFERENCES Transport(VehicleID),

    CONSTRAINT FK_SubwayTrain_TrainModel
        FOREIGN KEY (ModelName)
        REFERENCES TrainModel(ModelName),

    CONSTRAINT CHK_SubwayTrain_SetNumber
        CHECK (
            REGEXP_LIKE(
                TrainSetNumber,
                '^[A-Z0-9-]+$'
            )
        )
);


CREATE TABLE Passenger (
    PassengerID          VARCHAR2(10)    NOT NULL,
    FirstName            VARCHAR2(20)    NOT NULL,
    LastName             VARCHAR2(20)    NOT NULL,
    PassengerCategory    VARCHAR2(20)    DEFAULT 'Adult'  NOT NULL,

    CONSTRAINT PK_Passenger
        PRIMARY KEY (PassengerID),

    CONSTRAINT CHK_Passenger_Category
        CHECK (
            PassengerCategory IN (
                'Adult',
                'Child',
                'Senior',
                'Student'
            )
        )
);


CREATE TABLE Passes (
    TicketID            VARCHAR2(10)        NOT NULL,
    PassengerID         VARCHAR2(10)        NOT NULL,
    AmountPaid          NUMBER(8,2)     NOT NULL,
    TravellingStatus    VARCHAR2(20)    NOT NULL,
    PurchaseTime        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT PK_Passes
        PRIMARY KEY (TicketID),

    CONSTRAINT FK_Passes_Passenger
        FOREIGN KEY (PassengerID)
        REFERENCES Passenger(PassengerID),

    CONSTRAINT CHK_Passes_Amount
        CHECK (AmountPaid >= 0),

    CONSTRAINT CHK_Passes_Status
        CHECK (
            TravellingStatus IN (
                'Active',
                'Inactive'
            )
        )
);


CREATE TABLE ZonePass (
    TicketID             VARCHAR2(10)    NOT NULL,
    NumberOfValidZones   NUMBER(2)   NOT NULL,

    CONSTRAINT PK_ZonePass
        PRIMARY KEY (TicketID),

    CONSTRAINT FK_ZonePass_Passes
        FOREIGN KEY (TicketID)
        REFERENCES Passes(TicketID),

    CONSTRAINT CHK_ZonePass_ValidZones
        CHECK (NumberOfValidZones > 0)
);


CREATE TABLE TimedPass (
    TicketID     VARCHAR2(10)    NOT NULL,
    StartTime    TIMESTAMP       NOT NULL,
    EndTime      TIMESTAMP       NOT NULL,
    PassType     VARCHAR2(20)    NOT NULL,

    CONSTRAINT PK_TimedPass
        PRIMARY KEY (TicketID),

    CONSTRAINT FK_TimedPass_Passes
        FOREIGN KEY (TicketID)
        REFERENCES Passes(TicketID),

    CONSTRAINT CHK_TimedPass_Type
        CHECK (
            PassType IN (
                'Daily',
                'Weekly',
                'Monthly'
            )
        ),

    CONSTRAINT CHK_TimedPass_Times
        CHECK (EndTime > StartTime)
);


CREATE TABLE Route (
    RouteID             VARCHAR2(10)     NOT NULL,
    RouteNumber         NUMBER(3)        NOT NULL,
    RouteName           VARCHAR2(60)     NOT NULL,
    RouteDescription    VARCHAR2(200),
    Colour              VARCHAR2(20),

    CONSTRAINT PK_Route
        PRIMARY KEY (RouteID)

    Constraint UQ_Route_Number
        UNIQUE (RouteNumber)
);


CREATE TABLE Schedule (
    RouteID       VARCHAR2(10)        NOT NULL,
    StartTime     TIMESTAMP       NOT NULL,
    DayType       VARCHAR2(20)    NOT NULL,
    EndTime       TIMESTAMP       NOT NULL,
    Frequency     NUMBER(4)       NOT NULL,

    CONSTRAINT PK_Schedule
        PRIMARY KEY (
            RouteID,
            StartTime,
            DayType
        ),

    CONSTRAINT FK_Schedule_Route
        FOREIGN KEY (RouteID)
        REFERENCES Route(RouteID),

    CONSTRAINT CHK_Schedule_Frequency
        CHECK (Frequency > 0),

    CONSTRAINT CHK_Schedule_DayType
        CHECK (
            DayType IN (
                'Weekday',
                'Weekend',
                'Holiday'
            )
        ),

    CONSTRAINT CHK_Schedule_Times
        CHECK (EndTime > StartTime)
);


CREATE TABLE Zone (
    ZoneNumber         NUMBER(3)        NOT NULL,
    ZoneName           VARCHAR2(50)     NOT NULL,
    Colour             VARCHAR2(20),
    ZoneDescription    VARCHAR2(200),

    CONSTRAINT PK_Zone
        PRIMARY KEY (ZoneNumber),

    CONSTRAINT CHK_Zone_Number
        CHECK (ZoneNumber > 0)
);


CREATE TABLE TransportStation (
    StationID                   VARCHAR2(10)         NOT NULL,
    ZoneNumber                  NUMBER(3)        NOT NULL,
    StationName                 VARCHAR2(80)     NOT NULL,
    Address                     VARCHAR2(150)    NOT NULL,
    WheelchairAccessibility     CHAR(1)          NOT NULL,

    CONSTRAINT PK_TransportStation
        PRIMARY KEY (StationID),

    CONSTRAINT FK_Station_Zone
        FOREIGN KEY (ZoneNumber)
        REFERENCES Zone(ZoneNumber),

    CONSTRAINT CHK_Station_Wheelchair
        CHECK (WheelchairAccessibility IN ('Y', 'N'))
);


CREATE TABLE RouteStop (
    RouteID        VARCHAR2(10)    NOT NULL,
    StopNumber     NUMBER(4)   NOT NULL,
    StationID      VARCHAR2(10)    NOT NULL,

    CONSTRAINT PK_RouteStop
        PRIMARY KEY (
            RouteID,
            StopNumber
        ),

    CONSTRAINT FK_RouteStop_Route
        FOREIGN KEY (RouteID)
        REFERENCES Route(RouteID),

    CONSTRAINT FK_RouteStop_Station
        FOREIGN KEY (StationID)
        REFERENCES TransportStation(StationID),

    CONSTRAINT CHK_RouteStop_Number
        CHECK (StopNumber > 0)
);


CREATE TABLE Gate (
    GateID                  VARCHAR2(10)        NOT NULL,
    StationID               VARCHAR2(10)        NOT NULL,
    ActivationStatus        VARCHAR2(20)    NOT NULL,
    EnterOrExit             VARCHAR2(10)    NOT NULL,
    TotalEnterExitCount     NUMBER(10)      DEFAULT 0 NOT NULL,

    CONSTRAINT PK_Gate
        PRIMARY KEY (GateID),

    CONSTRAINT FK_Gate_Station
        FOREIGN KEY (StationID)
        REFERENCES TransportStation(StationID),

    CONSTRAINT CHK_Gate_Status
        CHECK (
            ActivationStatus IN (
                'Active',
                'Inactive'
            )
        ),

    CONSTRAINT CHK_Gate_Type
        CHECK (
            EnterOrExit IN (
                'Enter',
                'Exit'
            )
        ),

    CONSTRAINT CHK_Gate_Count
        CHECK (TotalEnterExitCount >= 0)
);


CREATE TABLE RunsOn (
    VehicleID    VARCHAR2(10)    NOT NULL,
    RouteID      VARCHAR2(10)    NOT NULL,

    CONSTRAINT PK_RunsOn
        PRIMARY KEY (
            VehicleID,
            RouteID
        ),

    CONSTRAINT FK_RunsOn_Transport
        FOREIGN KEY (VehicleID)
        REFERENCES Transport(VehicleID),

    CONSTRAINT FK_RunsOn_Route
        FOREIGN KEY (RouteID)
        REFERENCES Route(RouteID)
);

CREATE TABLE PassEnter (
    TicketID     VARCHAR2(10)    NOT NULL,
    GateID       VARCHAR2(10)    NOT NULL,
    EntryTime    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT PK_PassEnter
        PRIMARY KEY (
            TicketID,
            GateID,
            EntryTime
        ),

    CONSTRAINT FK_PassEnter_Passes
        FOREIGN KEY (TicketID)
        REFERENCES Passes(TicketID),

    CONSTRAINT FK_PassEnter_Gate
        FOREIGN KEY (GateID)
        REFERENCES Gate(GateID)
);


CREATE TABLE PassExit (
    TicketID    VARCHAR2(10)    NOT NULL,
    GateID      VARCHAR2(10)    NOT NULL,
    ExitTime    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT PK_PassExit
        PRIMARY KEY (
            TicketID,
            GateID,
            ExitTime
        ),

    CONSTRAINT FK_PassExit_Passes
        FOREIGN KEY (TicketID)
        REFERENCES Passes(TicketID),

    CONSTRAINT FK_PassExit_Gate
        FOREIGN KEY (GateID)
        REFERENCES Gate(GateID)
);