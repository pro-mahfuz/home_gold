import { Role, Permission } from "../../models/model.js";

export const getAllPermissions = async () => {
  const permissions = await Permission.findAll({
    raw: true, // get plain objects
    order: [["group", "ASC"], ["action", "ASC"]],
  });

  if (!permissions || permissions.length === 0) {
    throw { status: 400, message: "No permissions found" };
  }

  // Group permissions by `group` property
    const groupedPermissions = permissions.reduce((acc, perm) => {
      const group = perm.group || "default";

      if (!acc[group]) {
        acc[group] = [];
      }

      acc[group].push({
        id: perm.id,
        name: perm.name,
        action: perm.action,
      });

      return acc;
    }, {});

    // Convert grouped object into array of objects for easier frontend consumption
    const result = Object.entries(groupedPermissions).map(([group, permissions]) => ({
      group,
      permissions,
    }));

    //console.log(result);

    return result;
};


export const setPermissionsForRole = async ({ roleId, businessId, name, action, isActive, permissionIds }) => {
    if (!Array.isArray(permissionIds)) {
        throw { status: 400, message: "permissionIds[] are required" };
    }

    let role = await Role.findByPk(roleId);

    if (!role) {
        role = await Role.create({ 
          businessId,
          name,
          action,
          isActive
        });
    }else {
        role = await role.update({ name, action, isActive });
    }

    const permissions = await Permission.findAll({
        where: { id: permissionIds },
    });

    const setPermissions = await role.setPermissions(permissions); // overwrite existing ones
    return getPermissionsForRole(role.id);
    
};

export const getPermissionsForRole = async (roleId) => {
    if (!roleId) throw { status: 400, message: "roleId is required" };

    const role = await Role.findByPk(roleId, {
        include: [ 
            { model: Permission, as: "permissions" }
        ]
    });

    if (!role) throw { status: 404, message: "Role not found" };

    return role; // returns an array of permissions
};