# Train API

## Get Subway Train by Train-Set Number

### Endpoint

```http
GET /trains/:trainSetNumber
```

### Purpose

Retrieves information about a subway train using its unique train-set number.

The endpoint returns:

- Basic subway train information.
- The train's model information.
- The number of cars in the train.
- Manufacture year.
- Passenger capacity.
- Wheelchair accessibility.
- All routes that the train is currently registered to operate on.

---

## Request

### Method

```http
GET
```

### URL Parameter

| Parameter | Type | Description |
|---|---|---|
| `trainSetNumber` | String | Unique train-set number of the subway train. |

### Example Request

```http
GET /trains/TEST-001
```

---

## Response

### Success

**Status Code:** `200 OK`

Example:

```json
{
    "vehicleId": "V000000001",
    "trainSetNumber": "TEST-001",
    "modelName": "TestTrainModel",
    "numberOfCars": 6,
    "manufactureYear": 2020,
    "capacity": 500,
    "wheelchairAccessibility": "Y",
    "routeNumbers": [
        99,
        100
    ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `vehicleId` | String | System-generated unique identifier for the subway train. |
| `trainSetNumber` | String | Unique identifier assigned to the physical train set. |
| `modelName` | String | Name of the train model. |
| `numberOfCars` | Number | Number of cars in the train model. |
| `manufactureYear` | Number | Year the train was manufactured. |
| `capacity` | Number | Maximum passenger capacity of the train. |
| `wheelchairAccessibility` | String | Indicates whether the train is wheelchair accessible. `Y` means accessible and `N` means not accessible. |
| `routeNumbers` | Array | Route numbers that the train is currently registered to operate on. |

If the train is not registered to any route, `routeNumbers` will be an empty array:

```json
{
    "vehicleId": "V000000001",
    "trainSetNumber": "TEST-001",
    "modelName": "TestTrainModel",
    "numberOfCars": 6,
    "manufactureYear": 2020,
    "capacity": 500,
    "wheelchairAccessibility": "Y",
    "routeNumbers": []
}
```

---

## Error Responses

### Train Not Found

**Status Code:** `404 Not Found`

Returned when no subway train exists with the specified train-set number.

Example:

```json
{
    "success": false
}
```

### Internal Service Error

If an error occurs while retrieving the train information, the service returns `null`, which the controller converts into a `404 Not Found` response.

---

## Example Usage

### Request

```http
GET /trains/TRAIN-001
```

### Response

```json
{
    "vehicleId": "V000000015",
    "trainSetNumber": "TRAIN-001",
    "modelName": "SkyTrainMarkIII",
    "numberOfCars": 6,
    "manufactureYear": 2022,
    "capacity": 400,
    "wheelchairAccessibility": "Y",
    "routeNumbers": [
        99,
        100
    ]
}
```