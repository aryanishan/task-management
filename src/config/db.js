const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

async function getDbConnection() {
  if (dbInstance) return dbInstance;

  const isTest = process.env.NODE_ENV === 'test';
  // Use in-memory DB for tests, otherwise a file.
  const dbPath = isTest ? ':memory:' : path.join(__dirname, '../../database.sqlite');
  
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Automatically create table if it doesn't exist
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT 0,
      dueDate TEXT,
      category TEXT
    )
  `);

  return dbInstance;
}

module.exports = { getDbConnection };
