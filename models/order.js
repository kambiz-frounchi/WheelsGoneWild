module.exports = function(sequelize, DataTypes) {
  const Order = sequelize.define(
    "Order",
    {
      totalprice: {
        type: DataTypes.STRING,
        allowNull: false
      },
      state: {
        type: DataTypes.ENUM("pending", "ordered", "shipping", "delivered"),
        defaultValue: "pending"
      }
    },
    { timestamps: false }
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
