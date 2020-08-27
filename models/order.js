module.exports = function(sequelize, DataTypes) {
  const Order = sequelize.define(
    "Order",
    {
      totalprice: {
        type: DataTypes.STRING,
        allowNull: false
      },
      state: {
        type: DataTypes.ENUM("pending", "shipping", "delivered"),
        defaultValue: "pending"
      }
    },
    { timestamps: false }
  );

  Order.associate = function(models) {
    Order.belongsTo(models.Bike, {
      foreignKey: {
        allowNull: false
      }
    });

    Order.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Order;
};
