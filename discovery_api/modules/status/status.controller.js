import * as StatusService from "./status.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllStatus = async (req, res, next) =>{
    try {
        const data = await StatusService.getAllStatus();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createStatus = async (req, res, next) => {
    try {
        const data = await StatusService.createStatus(req);
        return success(res, data, "Status created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getStatusById = async (req, res, next) => {
    try {
        const data = await StatusService.getStatusById(req.params.id);
        return success(res, data, "Status retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateStatus = async (req, res, next) => {
    try {
        const data = await StatusService.updateStatus(req);
        return success(res, data, "Status updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const activeStatus = async (req, res, next) => {
    try {
        const data = await StatusService.activeStatus(req.params.id);
        return success(res, data, "Status activated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deactiveStatus = async (req, res, next) => {
    try {
        const data = await StatusService.deactiveStatus(req.params.id);
        return success(res, data, "Status deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deleteStatus = async (req, res, next) => {
    try {
        const data = await StatusService.deleteStatus(req.params.id);
        return success(res, data, "Status deleted successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}