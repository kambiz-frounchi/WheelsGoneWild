module.exports = function(sequelize, DataTypes) {
  const testCartItem = sequelize.define(
    "testCartItem",
    {
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      bike: {
        type: DataTypes.INTEGER
      }
    },
    { timestamps: false }
  );

  testCartItem.associate = function(models) {
    testCartItem.belongsTo(models.testCart, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return testCartItem;
};
