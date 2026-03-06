export default (sequelize, DataTypes) => {
  const StatusType = sequelize.define("StatusType", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    group: DataTypes.STRING,
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  },
    {
      tableName: "statustypes",
      timestamps: true,
      underscored: false,
    });

  StatusType.associate = (models) => {
    StatusType.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return StatusType;
};