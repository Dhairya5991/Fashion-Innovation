const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_urls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [], // URLs to product images
    },
    sustainability_metrics: {
      type: DataTypes.JSONB,
      defaultValue: {}, // e.g., { material: 'organic cotton', carbon_footprint: 'low' }
    },
    '3d_model_url': {
      type: DataTypes.STRING,
      allowNull: true, // URL to 3D garment model (e.g., GLB, FBX)
      validate: {
        isUrl: true,
      },
    },
  }, {
    tableName: 'products',
    timestamps: true,
  });

  Product.associate = (models) => {
    Product.hasMany(models.CartItem, { foreignKey: 'product_id', onDelete: 'RESTRICT' }); // Prevent deleting product if in cart
    Product.hasMany(models.OrderItem, { foreignKey: 'product_id', onDelete: 'RESTRICT' }); // Prevent deleting product if in order
  };

  return Product;
};
