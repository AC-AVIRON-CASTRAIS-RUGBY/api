const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\x1b[32mServer is running on port ${PORT}\x1b[0m`);
});