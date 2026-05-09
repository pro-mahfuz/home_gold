import * as RoleService from "./role.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllRoles = async (req, res, next) =>{
    try {
        const roles = await RoleService.getAllRoles();
        return success(res, roles, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const activeRole = async (req, res, next) => {
    try {
        const role = await RoleService.activeRole(req.params.id);
        return success(res, role, "Role activated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deactiveRole = async (req, res, next) => {
    try {
        const role = await RoleService.deactiveRole(req.params.id);
        return success(res, role, "Role deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deleteRole = async (req, res, next) => {
    try {
        const role = await RoleService.deleteRole(req.params.id);
        return success(res, role, "Role deleted successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}