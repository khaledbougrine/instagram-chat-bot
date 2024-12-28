const sequelize = require('../db');
const { DataTypes, Op } = require('sequelize');


const ProfileToDmModel = sequelize.define('ProfileToDM', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Définit ce champ comme clé primaire
    autoIncrement: true, // Rend cet identifiant auto-incrémenté
    allowNull: false, // Cet ID ne peut pas être nul
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Username doit être unique
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

ProfileToDmModel.addProfilesIfNotExist = async function (userList) {
  console.log('userList')
  console.log(userList)
  try {
    // Extract all userName values from the input list
    const userNames = userList.filter(item => item !== null).map((user) => user.userName);

    // Find existing users in the database
    const existingUsers = await ProfileToDmModel.findAll({
      where: {
        userName: { [Op.in]: userNames },
      },
      attributes: ['userName','name'], // Only retrieve userName for comparison
    });


    const existingUsersMap = new Map(
      existingUsers.filter(item => item !== null).map((user) => [user.userName, user.name])
    );

    const newUsers = [];
    const usersToUpdate = [];
// Filter out users that already exist and have a different name
    userList.forEach(user => {
      const existingname = existingUsersMap.get(user.userName);
      if (!existingname) {
        // User is new
        newUsers.push(user);
      } else if (existingname !== user.name) {
        // name is different, prepare for update
        usersToUpdate.push(user);
      }
    });
    // Update users with different names
    if (usersToUpdate.length > 0) {
      for (const user of usersToUpdate) {
        await ProfileToDmModel.update(
          { name: user.name }, // Update name
          { where: { userName: user.userName } } // Find user by userName
        );
      }
      console.log(`${usersToUpdate.length} users' names updated successfully.`);
    }
    // Insert new users in batch
    if (newUsers.length > 0) {
      await ProfileToDmModel.bulkCreate(newUsers);
      console.log(`${newUsers.length} users added successfully.`);
    } else {
      console.log('No new users to add.');
    }
  } catch (error) {
    console.error('Error adding users:', error);
  }
};

// Méthode pour nettoyer (supprimer) tous les profils
ProfileToDmModel.cleanProfiles = async function() {
  try {
    // Supprimer tous les enregistrements de la table
    const deletedProfiles = await ProfileToDmModel.destroy({
      where: {}, // Condition vide pour supprimer tous les profils
    });
    return deletedProfiles;
  } catch (error) {
    console.error('Error cleaning profiles:', error);
    throw error;
  }
};

module.exports = ProfileToDmModel;
