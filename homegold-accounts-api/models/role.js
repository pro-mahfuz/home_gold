export default (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: { type: DataTypes.STRING, allowNull: false },
    action: DataTypes.STRING,
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: "roles",
    timestamps: true
  });

  Role.associate = (models) => {
    Role.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });

    Role.hasMany(models.User, {
      foreignKey: "roleId",
      as: "users"
    });

    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: "roleId",
      otherKey: "permissionId",
      as: "permissions"
    });
  };

  return Role;
};
