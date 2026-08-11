# Schema Changes

A total of 4 tables were removed, 2 entities in an ISA and 2 on relationships. The new schema still fits the requirement milestone 2, as shown in the previouse ER diagram.

## 1. Removed `Transport` Table

The revised database focuses specifically on the subway system, so a generic transportation superclass was no longer necessary.

The attributes that were previously stored in `Transport` were moved directly into `SubwayTrain`:

```sql
ManufactureYear NUMBER(4) NOT NULL,
Capacity NUMBER(4) NOT NULL,
WheelchairAccessibility CHAR(1) NOT NULL
```

The foreign key from `SubwayTrain` to `Transport` was also removed.

---

## 2. Removed `Bus` Table

The entire `Bus` entity was removed.

---

## 3. Modified `SubwayTrain`

The `SubwayTrain` table now contains the vehicle information that was previously stored in `Transport`.

---

## 4. Changed ID Data Types

Many identifiers were changed from fixed-length `CHAR(10)` to variable-length `VARCHAR2(10)`.
`VARCHAR2` avoids unnecessary space padding associated with `CHAR`.

---

## 5. Added Default Passenger Category

The `PassengerCategory` attribute now has a default value.


If a passenger is inserted without specifying a category, the database automatically assigns it as Adult.

---

## 6. Simplified Pass Status

The allowed travelling statuses were reduced to Active and Inactive.

---

## 7. Added `RouteNumber`

A new `RouteNumber` attribute was added to the `Route` table.

A route now has a unique route number that can be used to identify it in addition to the internal `RouteID`.

---

## 8. Removed `Direction` from `Route`

Direction is no longer stored as an attribute of `Route` in the revised schema.

---

## 9. Changed Schedule Time Representation

The schedule time attributes were changed from `TIMESTAMP` to `VARCHAR2(5)`.

The values are intended to use the `HH:MM` format, for example:

```text
08:30
14:45
23:00
```

Constraints were added to ensure valid times:


---

## 10. Changed `RunsOn` Foreign Key

### Before

`RunsOn.VehicleID` referenced the general `Transport` table:

Since `Transport` was removed, a vehicle running on a route must now be a subway train.


---

## 11. Removed `ValidEntranceAt`

The `ValidEntranceAt` relationship table was removed since pass entrance can be validated by using the pass table and the passEntrance table.

---

## 12. Removed `ValidExitAt`

The `ValidExitAt` relationship table was also removed.

---