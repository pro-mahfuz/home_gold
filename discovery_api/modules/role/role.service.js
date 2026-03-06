import { Role, Permission } from "../../models/model.js";

export const getAllRoles = async () => {
    const roles = await Role.findAll({ include: [ 
        {model: Permission, as: "permissions"}
    ]});

    if (!roles || roles.length === 0) throw { status: 400, message: "No roles found" };
    
    return roles;
}

export const activeRole = async (id) => {
    const role = await Role.findByPk(id);
    if (!role) {
        throw { status: 404, message: "Role not found" };
    }

    role.isActive = true;
    await role.save();
    return role;
}

export const deactiveRole = async (id) => {
    const role = await Role.findByPk(id);
    if (!role) {
        throw { status: 404, message: "Role not found" };
    }

    role.isActive = false;
    await role.save();
    return role;
}

export const deleteRole = async (id) => {
    const role = await Role.findByPk(id);
    if (!role) {
        throw { status: 404, message: "Role not found" };
    }

    console.log("role: ", role);

    if (role.Permission) {
        throw { status: 404, message: "Can't delete, role has already permissions" };
    }

    role.destroy();
    return role;
}