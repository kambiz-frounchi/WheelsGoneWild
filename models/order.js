module.exports = function(sequelize, DataTypes) {
  const Order = sequelize.define(
    "Order",
    {
      totalprice: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false
      },
      state: {
        type: DataTypes.ENUM("pending", "ordered", "shipping", "delivered"),
        defaultValue: "pending"
      },
      totalquantity: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    { timestamps: true }
  );

  Order.associate = function(models) {
    Order.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });

    Order.hasMany(models.OrderItem, {
      onDelete: "cascade"
    });
  };
  return Order;
};
