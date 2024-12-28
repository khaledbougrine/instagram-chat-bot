const { DataTypes, Op } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

/**
 * Adds a list of users to the database if they don't already exist.
 * @param {Array<{ userName: string, password: string }>} userList - List of user objects.
 */
User.addUsersIfNotExist = async function (userList) {
  console.log('userList')
  console.log(userList)
  try {
    // Extract all userName values from the input list
    const userNames = userList.filter(item => item !== null).map((user) => user.userName);

    // Find existing users in the database
    const existingUsers = await User.findAll({
      where: {
        userName: { [Op.in]: userNames },
      },
      attributes: ['userName','password'], // Only retrieve userName for comparison
    });

    // Get a set of existing userNames
    // const existingUserNames = new Set(existingUsers.filter(item => item !== null).map((user) => user.userName));

    // Get a set of existing userNames and their corresponding passwords
    const existingUsersMap = new Map(
      existingUsers.filter(item => item !== null).map((user) => [user.userName, user.password])
    );

    const newUsers = [];
    const usersToUpdate = [];
// Filter out users that already exist and have a different password
    userList.forEach(user => {
      const existingPassword = existingUsersMap.get(user.userName);
      if (!existingPassword) {
        // User is new
        newUsers.push(user);
      } else if (existingPassword !== user.password) {
        // Password is different, prepare for update
        usersToUpdate.push(user);
      }
    });
    // Update users with different passwords
    if (usersToUpdate.length > 0) {
      for (const user of usersToUpdate) {
        await User.update(
          { password: user.password }, // Update password
          { where: { userName: user.userName } } // Find user by userName
        );
      }
      console.log(`${usersToUpdate.length} users' passwords updated successfully.`);
    }
    // Insert new users in batch
    if (newUsers.length > 0) {
      await User.bulkCreate(newUsers);
      console.log(`${newUsers.length} users added successfully.`);
    } else {
      console.log('No new users to add.');
    }
  } catch (error) {
    console.error('Error adding users:', error);
  }
};


/**
 * Deletes all users from the database.
 */
User.clearAllUsers = async function () {
  try {
    const deletedCount = await User.destroy({
      where: {}, // No condition means delete all rows
    });
    console.log(`${deletedCount} users deleted successfully.`);
  } catch (error) {
    console.error('Error clearing users:', error);
  }
};

module.exports = User;
