const { Sequelize } = require('sequelize');
const path = require('path');

// Define the SQLite database file path
const dbPath = path.join(__dirname, '../app.db');
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
