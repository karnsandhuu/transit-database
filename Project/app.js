const express = require('express');
const appRoutes = require('./routes/demotableRoutes');
const gateRoutes = require('./routes/gateRoutes');
const databaseRoutes = require('./routes/databaseRoutes');
const passengerRoutes = require('./routes/passengerRoutes');
const passRoutes = require('./routes/passRoutes');
const routeRoutes = require('./routes/routeRoutes');
const stationRoutes = require('./routes/stationRoutes');
const statsRoutes = require('./routes/statsRoutes');
const trainRoutes = require('./routes/trainRoutes');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/', appRoutes);
app.use('/', gateRoutes);
app.use('/', databaseRoutes);
app.use('/', passengerRoutes);
app.use('/', passRoutes);
app.use('/', routeRoutes);
app.use('/', stationRoutes);
app.use('/', statsRoutes);
app.use('/', trainRoutes);

module.exports = app;