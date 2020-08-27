module.exports = function(sequelize, DataTypes) {
  const Inventory = sequelize.define(
    "Inventory",
    {
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    { timestamps: false }
  );

  Inventory.associate = function(models) {
    Inventory.belongsTo(models.Bike, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Inventory;
};
