// Global Imports
const express = require('express');
require('dotenv').config();

// Local Imports
const rootRoute = require('./routes/rootRoute');
const { initExpress } = require('./modules/initExpress');
require('./modules/initDatabase').initDB();

// Express Setup
const app = express();
initExpress(app);

// Express Routes
app.use('/', rootRoute);

// HTTP address/port for our web app
const server = app.listen(process.env.PORT || 5000, process.env.ADDRESS || 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Web server running on http://${address}:${port}`);
});
