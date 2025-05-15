const express = require('express');
const routes = require('./routes/index');

const tournamentRoutes = require('./routes/tournamentRoutes');

const app = express();

app.use(express.json());

app.use('/', routes);
app.use('/api/tournaments', tournamentRoutes);

module.exports = app;