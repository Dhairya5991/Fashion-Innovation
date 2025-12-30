const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measurements: {
      type: DataTypes.JSONB,
      defaultValue: {}, // Stores body dimensions like { height: 170, chest: 90, waist: 75, hips: 95 }
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true, // URL to generated 3D avatar model
      validate: {
        isUrl: true,
      },
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasMany(models.CartItem, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    User.hasMany(models.Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  };

  return User;
};
