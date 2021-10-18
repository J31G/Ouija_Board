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
