module.exports = function(sequelize, DataTypes) {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    { timestamps: false }
  );

  OrderItem.associate = function(models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: {
        allowNull: false
      }
    });

    OrderItem.belongsTo(models.Bike, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return OrderItem;
};
