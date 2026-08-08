const express = require('express');
const appRoutes = require('./routes/demotableRoutes');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/', appRoutes);

module.exports = app;