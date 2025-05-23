const express = require('express');
const routes = require('./routes/index');

const tournamentRoutes = require('./routes/tournamentRoutes');
const poolRoutes = require('./routes/poolRoutes');
const teamRoutes = require('./routes/teamRoutes');
const gameRoutes = require('./routes/gameRoutes');
const phaseRoutes = require('./routes/phaseRoutes');
const lockerRoomRoutes = require('./routes/lockerRoomRoutes');
const refereeRoutes = require('./routes/refereeRoutes');

const app = express();

app.use(express.json());

app.use('/', routes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/phases', phaseRoutes);
app.use('/api/locker-rooms', lockerRoomRoutes);
app.use('/api/referees', refereeRoutes);

module.exports = app;