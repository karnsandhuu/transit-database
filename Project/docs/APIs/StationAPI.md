# Station API

## Get All Zones

### Endpoint

```text
GET /zones
```

### Purpose

Retrieves all zones registered in the system.

The zones are returned in ascending order by `ZoneNumber`.

### Request

**Method**

```text
GET
```

No request parameters or request body are required.

### Example

```text
GET /zones
```

### Successful Response

**Status Code**

```text
200 OK
```

**Response Body**

```json
[
    {
        "zoneNumber": 1,
        "zoneName": "Downtown",
        "colour": "Red",
        "zoneDescription": "Central transit zone"
    },
    {
        "zoneNumber": 2,
        "zoneName": "West",
        "colour": "Blue",
        "zoneDescription": "Western transit zone"
    }
]
```

If no zones exist, an empty array is returned:

```json
[]
```

---

# Get All Stations

### Endpoint

```text
GET /stations
```

### Purpose

Retrieves all stations registered in the system.

The stations are returned in ascending order by `StationID`.

### Request

**Method**

```text
GET
```

No request parameters or request body are required.

### Example

```text
GET /stations
```

### Successful Response

**Status Code**

```text
200 OK
```

**Response Body**

```json
[
    {
        "stationId": "S000000001",
        "zoneNumber": 1,
        "stationName": "Downtown Station",
        "address": "123 Main Street",
        "wheelchairAccessibility": "Y"
    },
    {
        "stationId": "S000000002",
        "zoneNumber": 2,
        "stationName": "West Station",
        "address": "456 West Avenue",
        "wheelchairAccessibility": "N"
    }
]
```

If no stations exist, an empty array is returned:

```json
[]
```

---

# Get Stations by Zone

### Endpoint

```text
GET /zones/:zoneNumber/stations
```

### Purpose

Retrieves all stations belonging to a specific zone.

### Request

**Method**

```text
GET
```

### URL Parameters

| Parameter | Type | Description |
|---|---|---|
| `zoneNumber` | Number | The zone number whose stations should be retrieved. |

### Example

```text
GET /zones/2/stations
```

### Successful Response

**Status Code**

```text
200 OK
```

**Response Body**

```json
[
    {
        "stationId": "S000000003",
        "zoneNumber": 2,
        "stationName": "West Station",
        "address": "456 West Avenue",
        "wheelchairAccessibility": "Y"
    },
    {
        "stationId": "S000000004",
        "zoneNumber": 2,
        "stationName": "Central West Station",
        "address": "789 West Road",
        "wheelchairAccessibility": "N"
    }
]
```

If the zone exists but contains no stations, an empty array is returned:

```json
[]
```

---

# API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/zones` | Get all zones |
| `GET` | `/stations` | Get all stations |
| `GET` | `/zones/:zoneNumber/stations` | Get all stations in a specific zone |

## Notes

The current routes expose only **read operations** for zones and stations.

The following service functions are currently not exposed through these routes:

- `insertZone`
- `getZoneById`
- `insertStation`
- `getStationById`

The current API therefore allows clients to **retrieve** zones and stations but not create or retrieve an individual zone/station by ID through HTTP.