export default (sequelize, DataTypes) => {
  const Warehouse = sequelize.define("Warehouse", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: "warehouses",
    timestamps: true,
    underscored: false,
  });

  Warehouse.associate = (models) => {
    Warehouse.hasMany(models.Stock, {
      foreignKey: "warehouseId",
      as: "stocks",
    });

    Warehouse.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return Warehouse;
};
