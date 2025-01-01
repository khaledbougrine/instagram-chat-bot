const { Sequelize } = require('sequelize');
const path = require('path');
const os = require('os');

// Define the SQLite database file path
const dbPath =path.join(os.tmpdir(), 'app.db');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Disable SQL query logging for cleaner output
});
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;
