const passport = require('passport');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { initialise: initialisePassport } = require('./initPassport');

module.exports.initDB = async () => {
  // Open datafiles
  const db = await open({
    filename: './db/app.db',
    driver: sqlite3.Database,
  });

  // Get our user list
  const users = await db.all('SELECT * FROM USERS');

  // Setup passport
  initialisePassport(
    passport,
    (email) => users.find((user) => user.EMAIL === email),
    (id) => users.find((user) => user.ID === id),
  );

  db.close();

  return users;
};
