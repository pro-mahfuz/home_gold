export default (sequelize, DataTypes) => {
  const Unit = sequelize.define("Unit", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: "units",
    timestamps: true
  });

  Unit.associate = (models) => {
    Unit.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return Unit;
};
