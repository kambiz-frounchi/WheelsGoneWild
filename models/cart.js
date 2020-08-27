module.exports = function(sequelize, DataTypes) {
  const Cart = sequelize.define(
    "Cart",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      bikeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    { timestamps: false }
  );

  return Cart;
};
