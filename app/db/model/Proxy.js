const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Proxy = sequelize.define('Proxy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  port: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'proxies', // Optional: specify the table name if different from 'Proxies'
  timestamps: true,     // Optional: enable createdAt and updatedAt fields
});


// Method to add or update a proxy
Proxy.addProxyIfNotExist = async function (proxyDetails) {
  console.log(proxyDetails)
  console.log('proxyDetails')
  try {
    if (!proxyDetails || !proxyDetails.address || !proxyDetails.port) {
      throw new Error('Proxy details must include address and port.');
    }

    const { address, port, userName, password } = proxyDetails;

    // Check if a proxy with the same address and port already exists
    const existingProxy = await Proxy.findOne({
      where: { address, port },
    });

    if (!existingProxy) {
      // Proxy doesn't exist, so create a new one
      await Proxy.create({ address, port, userName, password });
      console.log('Proxy added successfully.');
    } else if (
      existingProxy.userName !== userName ||
      existingProxy.password !== password
    ) {
      // Proxy exists but some details differ, so update it
      await Proxy.update(
        { userName, password },
        { where: { id: existingProxy.id } }
      );
      console.log('Proxy updated successfully.');
    } else {
      console.log('Proxy already exists with the same details.');
    }
  } catch (error) {
    console.error('Error in addProxyIfNotExist:', error.message || error);
    throw error;
  }
};

// Method to clear all proxies
Proxy.clearAllProxies = async function () {
  try {
    const deletedCount = await Proxy.destroy({
      where: {}, // Empty condition deletes all rows
    });
    console.log(`${deletedCount} proxies cleared successfully.`);
    return deletedCount;
  } catch (error) {
    console.error('Error clearing proxies:', error.message || error);
    throw error;
  }
};
module.exports = Proxy;
