const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

module.exports.getCharacters = async () => {
  // Open datafiles
  const db = await open({
    filename: './db/app.db',
    driver: sqlite3.Database,
  });

  const allCharacters = await db.all('SELECT * FROM CHARACTER_LOOKUP');

  db.close();

  return allCharacters;
};

module.exports.saveConfig = async (data) => {
  // Open datafiles
  const db = await open({
    filename: './db/app.db',
    driver: sqlite3.Database,
  });

  data.forEach(async (d) => {
    await db.all(`UPDATE CHARACTER_LOOKUP SET X = '${d.X}', Y = '${d.Y}' WHERE CHARACTER = '${d.char}'`);
  });

  db.close();
};

module.exports.getDelay = async () => {
  // Open datafiles
  const db = await open({
    filename: './db/app.db',
    driver: sqlite3.Database,
  });

  const delay = await db.all("SELECT VALUE FROM CONFIG WHERE KEY = 'DELAY_BETWEEN_CHARS'");

  db.close();

  return delay;
};

module.exports.setDelay = async (amount) => {
  // Open datafiles
  const db = await open({
    filename: './db/app.db',
    driver: sqlite3.Database,
  });

  const delay = await db.all(`UPDATE CONFIG SET VALUE = ${amount} WHERE KEY = 'DELAY_BETWEEN_CHARS'`);

  db.close();

  return delay;
};
