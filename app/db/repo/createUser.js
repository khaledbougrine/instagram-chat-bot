const User = require('../model/User');

const createUser = async (name, email) => {
  try {
    const user = await User.create({ name, email });
    console.log('User created:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

createUser('John Doe', 'john.doe@example.com');
