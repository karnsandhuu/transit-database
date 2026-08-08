const gateController = require('./controllers/gateController');

// Get all gates at a station
app.get(
    '/stations/:stationId/gates',
    gateController.getGatesByStation
);

// Enter through a gate
app.post(
    '/gates/:gateId/enter',
    gateController.enterGate
);

// Exit through a gate
app.post(
    '/gates/:gateId/exit',
    gateController.exitGate
);
