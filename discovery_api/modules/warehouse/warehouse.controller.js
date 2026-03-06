import * as WarehouseService from "./warehouse.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllWarehouse = async (req, res, next) =>{
    try {
        const data = await WarehouseService.getAllWarehouse();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createWarehouse = async (req, res, next) => {
    try {
        console.log("Warehouse create Request: ", req.body);
        const data = await WarehouseService.createWarehouse(req);
        return success(res, data, "Warehouse created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getWarehouseById = async (req, res, next) => {
    try {
        const data = await WarehouseService.getWarehouseById(req.params.id);
        return success(res, data, "Warehouse retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateWarehouse = async (req, res, next) => {
    try {
        const data = await WarehouseService.updateWarehouse(req.params.id, req);
        return success(res, data, "Warehouse updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const activeWarehouse = async (req, res, next) => {
    try {
        const data = await WarehouseService.activeWarehouse(req.params.id);
        return success(res, data, "Warehouse activated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deactiveWarehouse = async (req, res, next) => {
    try {
        const data = await WarehouseService.deactiveWarehouse(req.params.id);
        return success(res, data, "Warehouse deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deleteWarehouse = async (req, res, next) => {
    try {
        const data = await WarehouseService.deleteWarehouse(req.params.id);
        return success(res, data, "Warehouse deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}