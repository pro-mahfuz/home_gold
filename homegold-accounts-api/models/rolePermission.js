export default (sequelize, DataTypes) => {
  const RolePermission = sequelize.define("RolePermission", {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "rolepermissions",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['roleId', 'permissionId'],
      },
    ],
  });

  RolePermission.associate = (models) => {
    RolePermission.belongsTo(models.Role, { foreignKey: "roleId" });
    RolePermission.belongsTo(models.Permission, { foreignKey: "permissionId" });
  };

  return RolePermission;
};
// This code defines a RolePermission model using Sequelize ORM.
// The RolePermission model is an empty model that serves as a junction table for many-to-many relationships 
// between Role and Permission models.,
    