const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const  User = sequelize.define('Users', {
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
    },
  });

  // Sync the model with the database
  sequelize.sync()
  .then(() => {
    console.log('User model synced with the database');
  })
  .catch((err) => {
    console.error('Error syncing User model:', err);
  });
}
