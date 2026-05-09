import * as PermissionService from "./permission.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllPermissions = async (req, res, next) =>{
    try {
        const permissions = await PermissionService.getAllPermissions();
        return success(res, permissions, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

/**
 * Set (overwrite) permissions for a role
 * @param {req.body} { roleId, permissionIds: [1,2,3] }
 */
export const setPermissionsForRole = async (req, res) => {

    if (!Array.isArray(req.body.permissionIds)) {
        return res.status(400).json({ message: "permissionIds[] are required" });
    }

    try {
        const setPermissions = await PermissionService.setPermissionsForRole(req.body);
        
        return success(res, setPermissions, "Permissions updated for role", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};

export const getPermissionsForRole = async (req, res) => {
    const { roleId } = req.params;
    if (!roleId) return res.status(400).json({ message: "roleId is required" });

    try {
        const permissions = await PermissionService.getPermissionsForRole(roleId);
        return success(res, permissions, "Permissions retrieved for role", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};