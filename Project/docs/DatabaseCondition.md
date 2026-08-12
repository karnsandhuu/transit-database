# Populated Database Tables

This document shows the populated contents of all 15 database tables after baseData.sql is ran
---

## 1. TrainModel

| ModelName | Capacity |
|---|---:|
| Mark I | 4 |
| Mark II | 2 |
| Mark III | 4 |
| Mark V | 6 |
| Alstom | 5 |

---

## 2. SubwayTrain

| VehicleID | TrainSetNumber | ModelName | ManufactureYear | Capacity | WheelchairAccessibility |
|---|---|---|---:|---:|---|
| V000000001 | TS-100 | Mark I | 2015 | 60 | Y |
| V000000002 | TS-101 | Mark II | 2018 | 45 | Y |
| V000000003 | TS-102 | Mark III | 2010 | 80 | N |
| V000000004 | TS-103 | Mark V | 2021 | 120 | Y |
| V000000005 | TS-104 | Alstom | 2020 | 100 | Y |

---

## 3. Passenger

| PassengerID | FirstName | LastName | PassengerCategory |
|---|---|---|---|
| P000000001 | John | Doe | Adult |
| P000000005 | Charlie | Davis | Adult |
| P000000006 | David | Wilson | Adult |
| P000000002 | Jane | Smith | Student |
| P000000007 | Emma | Taylor | Student |
| P000000008 | Liam | Anderson | Student |
| P000000003 | Alice | Johnson | Senior |
| P000000009 | Robert | Martin | Senior |
| P000000010 | Susan | Thompson | Senior |
| P000000004 | Bob | Brown | Child |
| P000000011 | Emily | White | Child |

---

## 4. Passes

| TicketID | PassengerID | AmountPaid | TravellingStatus | PurchaseTime |
|---|---|---:|---|---|
| T000000001 | P000000001 | 105.00 | Active | CURRENT_TIMESTAMP |
| T000000002 | P000000002 | 55.00 | Active | CURRENT_TIMESTAMP |
| T000000003 | P000000002 | 100.00 | Active | CURRENT_TIMESTAMP |
| T000000004 | P000000003 | 45.00 | Active | CURRENT_TIMESTAMP |
| T000000005 | P000000003 | 30.00 | Active | CURRENT_TIMESTAMP |
| T000000006 | P000000003 | 105.00 | Active | CURRENT_TIMESTAMP |
| T000000007 | P000000004 | 30.00 | Active | CURRENT_TIMESTAMP |
| T000000008 | P000000005 | 55.00 | Active | CURRENT_TIMESTAMP |
| T000000009 | P000000005 | 100.00 | Active | CURRENT_TIMESTAMP |
| T000000010 | P000000006 | 55.00 | Active | CURRENT_TIMESTAMP |
| T000000011 | P000000007 | 30.00 | Active | CURRENT_TIMESTAMP |
| T000000012 | P000000008 | 105.00 | Active | CURRENT_TIMESTAMP |
| T000000013 | P000000009 | 55.00 | Active | CURRENT_TIMESTAMP |
| T000000014 | P000000010 | 45.00 | Active | CURRENT_TIMESTAMP |
| T000000015 | P000000003 | 105.00 | Active | CURRENT_TIMESTAMP |
| T000000016 | P000000003 | 105.00 | Active | CURRENT_TIMESTAMP |

---

## 5. ZonePass

| TicketID | ZoneID |
|---|---:|
| T000000001 | 3 |
| T000000002 | 1 |
| T000000004 | 2 |
| T000000005 | 1 |
| T000000007 | 2 |
| T000000009 | 3 |
| T000000010 | 1 |
| T000000012 | 3 |
| T000000014 | 2 |

---

## 6. TimedPass

| TicketID | StartTime | EndTime | PassType |
|---|---|---|---|
| T000000003 | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP + 7 days | Weekly |
| T000000006 | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP + 1 month | Monthly |
| T000000008 | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP + 1 day | Daily |
| T000000011 | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP + 1 day | Daily |
| T000000013 | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP + 7 days | Weekly |
| T000000015 | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP + 1 days | Daily |
| T000000016 | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP + 7 days | Weekly |

---

## 7. Route

| RouteID | RouteNumber | RouteName | RouteDescription | Colour |
|---|---:|---|---|---|
| R000000001 | 99 | 99 B-Line | Express to UBC | Orange |
| R000000002 | 1 | Expo Line | Downtown to Surrey | Blue |
| R000000003 | 2 | Canada Line | Richmond to Downtown | Light Blue |
| R000000004 | 3 | Millennium | VCC to Lafarge | Yellow |
| R000000005 | 49 | 49 | Metrotown to UBC | Red |

---

## 8. Schedule

| RouteID | StartTime | DayType | EndTime | Frequency |
|---|---|---|---|---:|
| R000000001 | 06:00 | Weekday | 23:00 | 5 |
| R000000001 | 07:00 | Weekend | 22:00 | 10 |
| R000000001 | 08:00 | Holiday | 21:00 | 15 |
| R000000002 | 05:00 | Weekday | 01:00 | 3 |
| R000000002 | 06:00 | Weekend | 01:00 | 5 |
| R000000002 | 07:00 | Holiday | 00:00 | 8 |
| R000000003 | 05:30 | Weekday | 00:30 | 5 |
| R000000003 | 06:00 | Weekend | 00:30 | 7 |
| R000000003 | 07:00 | Holiday | 23:30 | 10 |
| R000000004 | 05:30 | Weekday | 00:30 | 4 |
| R000000004 | 06:30 | Weekend | 00:30 | 7 |
| R000000004 | 07:00 | Holiday | 23:00 | 10 |
| R000000005 | 05:00 | Weekday | 23:30 | 10 |
| R000000005 | 07:00 | Weekend | 23:00 | 15 |
| R000000005 | 08:00 | Holiday | 22:00 | 20 |

---

## 9. Zone

| ZoneID | ZoneName | Colour | Description |
|---:|---|---|---|
| 1 | Vancouver | Green | Central Hub |
| 2 | Burnaby/Richmond | Yellow | Inner Suburbs |
| 3 | Surrey/Langley | Red | Outer Suburbs |
| 4 | North Shore | Blue | Mountains |
| 5 | Delta | Orange | South of Fraser |

---

## 10. TransportStation

| StationID | ZoneID | StationName | Address | Accessibility |
|---|---:|---|---|---|
| S000000001 | 1 | Waterfront | 601 W Cordova St | Y |
| S000000002 | 2 | Metrotown | 6300 Central Blvd | Y |
| S000000003 | 3 | Surrey Central | 10275 City Pkwy | N |
| S000000004 | 1 | UBC Exchange | 6131 Student Union Blvd | Y |
| S000000005 | 2 | Richmond-Brighouse | 6971 No 3 Rd | Y |
| S000000006 | 1 | Commercial-Broadway | 1701 E Broadway | Y |
| S000000007 | 1 | Joyce-Collingwood | 5094 Joyce St | Y |
| S000000008 | 1 | Marine Drive | 8575 Cambie St | Y |
| S000000009 | 1 | VCC-Clark | 115 W 1st St | Y |
| S000000010 | 2 | Lougheed Town Centre | 9855 Austin Rd | Y |
| S000000011 | 1 | Langara-49th | 535 W 49th Ave | Y |

---

## 11. RouteStop

| RouteID | StopNumber | StationID |
|---|---:|---|
| R000000001 | 1 | S000000004 |
| R000000001 | 2 | S000000006 |
| R000000001 | 3 | S000000007 |
| R000000002 | 1 | S000000001 |
| R000000002 | 2 | S000000006 |
| R000000002 | 3 | S000000003 |
| R000000003 | 1 | S000000005 |
| R000000003 | 2 | S000000008 |
| R000000003 | 3 | S000000001 |
| R000000004 | 1 | S000000009 |
| R000000004 | 2 | S000000006 |
| R000000004 | 3 | S000000010 |
| R000000005 | 1 | S000000002 |
| R000000005 | 2 | S000000011 |
| R000000005 | 3 | S000000004 |

---

## 12. Gate

| GateID | StationID | Status | EnterOrExit | TotalEnterExitCount |
|---|---|---|---|---:|
| G000000001 | S000000001 | Active | Enter | 15 |
| G000000002 | S000000001 | Active | Exit | 145 |
| G000000003 | S000000001 | Inactive | Enter | 50 |
| G000000004 | S000000002 | Active | Enter | 80 |
| G000000005 | S000000002 | Active | Exit | 78 |
| G000000006 | S000000002 | Inactive | Exit | 32 |
| G000000007 | S000000003 | Active | Enter | 120 |
| G000000008 | S000000003 | Active | Exit | 115 |
| G000000009 | S000000003 | Inactive | Enter | 45 |
| G000000010 | S000000004 | Active | Enter | 500 |
| G000000011 | S000000004 | Active | Exit | 480 |
| G000000012 | S000000004 | Inactive | Exit | 180 |
| G000000013 | S000000005 | Active | Enter | 65 |
| G000000014 | S000000005 | Active | Exit | 62 |
| G000000015 | S000000005 | Inactive | Enter | 21 |
| G000000016 | S000000006 | Active | Enter | 110 |
| G000000017 | S000000006 | Active | Exit | 105 |
| G000000018 | S000000006 | Inactive | Exit | 40 |
| G000000019 | S000000007 | Active | Enter | 70 |
| G000000020 | S000000007 | Active | Exit | 68 |
| G000000021 | S000000007 | Inactive | Enter | 25 |
| G000000022 | S000000008 | Active | Enter | 45 |
| G000000023 | S000000008 | Active | Exit | 43 |
| G000000024 | S000000008 | Inactive | Exit | 15 |
| G000000025 | S000000009 | Active | Enter | 35 |
| G000000026 | S000000009 | Active | Exit | 33 |
| G000000027 | S000000009 | Inactive | Enter | 90 |
| G000000028 | S000000010 | Active | Enter | 60 |
| G000000029 | S000000010 | Active | Exit | 58 |
| G000000030 | S000000010 | Inactive | Exit | 19 |
| G000000031 | S000000011 | Active | Enter | 40 |
| G000000032 | S000000011 | Active | Exit | 38 |
| G000000033 | S000000011 | Inactive | Enter | 12 |

---

## 13. RunsOn

| VehicleID | RouteID |
|---|---|
| V000000001 | R000000001 |
| V000000002 | R000000002 |
| V000000003 | R000000003 |
| V000000004 | R000000004 |
| V000000005 | R000000005 |

---

## 14. PassEnter

| TicketID | GateID | EntryTime |
|---|---|---|
| T000000001 | G000000001 | CURRENT_TIMESTAMP |
| T000000002 | G000000003 | CURRENT_TIMESTAMP |
| T000000003 | G000000005 | CURRENT_TIMESTAMP |
| T000000004 | G000000001 | CURRENT_TIMESTAMP |
| T000000005 | G000000003 | CURRENT_TIMESTAMP |

---

## 15. PassExit

| TicketID | GateID | ExitTime |
|---|---|---|
| T000000001 | G000000002 | CURRENT_TIMESTAMP |
| T000000002 | G000000004 | CURRENT_TIMESTAMP |
| T000000003 | G000000002 | CURRENT_TIMESTAMP |
| T000000004 | G000000004 | CURRENT_TIMESTAMP |
| T000000005 | G000000002 | CURRENT_TIMESTAMP |