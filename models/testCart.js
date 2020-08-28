module.exports = function(sequelize, DataTypes) {
  const testCart = sequelize.define(
    "testCart",
    {
      price: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    { timestamps: false }
  );
  testCart.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    testCart.hasMany(models.testCartItem, {
      onDelete: "cascade"
    });
  };
  return testCart;
};
