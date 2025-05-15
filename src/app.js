const express = require('express');
const routes = require('./routes/index');

const tournamentRoutes = require('./routes/tournamentRoutes');
const poolRoutes = require('./routes/poolRoutes');
const teamRoutes = require('./routes/teamRoutes');

const app = express();

app.use(express.json());

app.use('/', routes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/teams', teamRoutes);

module.exports = app;