import * as UserService from "./user.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllUser = async (req, res, next) =>{
    try {
        const users = await UserService.getAllUser();
        return success(res, users, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createUser = async (req, res, next) => {
    try {
        const user = await UserService.createUser(req);
        return success(res, user, "User created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        return success(res, user, "User retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const user = await UserService.updateUser(req);
        return success(res, user, "User updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const activeUser = async (req, res, next) => {
    try {
        const user = await UserService.activeUser(req.params.id);
        return success(res, user, "User activated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deactiveUser = async (req, res, next) => {
    try {
        const user = await UserService.deactiveUser(req.params.id);
        return success(res, user, "User deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const user = await UserService.deleteUser(req.params.id);
        return success(res, user, "User deleted successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}