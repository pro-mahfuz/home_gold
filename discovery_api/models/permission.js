export default (sequelize, DataTypes) => {
  const Permission = sequelize.define("Permission", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    group: DataTypes.STRING,
    name: DataTypes.STRING,
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "permissions",
    timestamps: true,
    underscored: false,
  });

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission, // 
      foreignKey: "permissionId",
      otherKey: "roleId"
    });
  };

  return Permission;
};