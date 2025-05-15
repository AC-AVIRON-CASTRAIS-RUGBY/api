const express = require('express');
const routes = require('./routes/index');

const tournamentRoutes = require('./routes/tournamentRoutes');
const poolRoutes = require('./routes/poolRoutes');

const app = express();

app.use(express.json());

app.use('/', routes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/pools', poolRoutes);

module.exports = app;