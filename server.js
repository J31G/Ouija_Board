// Global Imports
const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Local Imports
const { initialise: initialisePassport } = require('./modules/initPassport');
const rootRoute = require('./routes/rootRoute');

// TEMP: UNTIL DB, STORE USER IN HERE
(async () => {
  const users = [
    {
      id: 123,
      name: 'Jamie',
      email: 'jamie@lambertstock.com',
      password: await bcrypt.hash('Abcd1234', 10),
    },
  ];
  initialisePassport(
    passport,
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id),
  );
})();

// Express Setup
const app = express();
app.set('view engine', 'ejs');
app.set('views', './public/views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Express Routes
app.use('/', rootRoute);

// HTTP port for our express app
const server = app.listen(process.env.PORT || 5000, process.env.ADDRESS || 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Web server running on http://${address}:${port}`);
});
