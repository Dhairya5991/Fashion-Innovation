const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // refers to table name
        key: 'id',
      },
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true, // Payment gateway transaction ID
    },
    shipping_address: {
      type: DataTypes.JSONB,
      allowNull: false, // e.g., { street: '123 Main St', city: 'Anytown', state: 'Anystate', zip: '12345', country: 'USA' }
    },
  }, {
    tableName: 'orders',
    timestamps: true,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'user_id' });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
  };

  return Order;
};
