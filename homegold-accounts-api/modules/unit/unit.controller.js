import * as UnitService from "./unit.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllUnit = async (req, res, next) =>{
    try {
        const data = await UnitService.getAllUnit();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createUnit = async (req, res, next) => {
    try {
        console.log("Unit create Request: ", req.body);
        const data = await UnitService.createUnit(req);
        return success(res, data, "Unit created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getUnitById = async (req, res, next) => {
    try {
        const data = await UnitService.getUnitById(req.params.id);
        return success(res, data, "Unit retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateUnit = async (req, res, next) => {
    try {
        const data = await UnitService.updateUnit(req);
        return success(res, data, "Unit updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const activeUnit = async (req, res, next) => {
    try {
        const data = await UnitService.activeUnit(req.params.id);
        return success(res, data, "Unit activated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deactiveUnit = async (req, res, next) => {
    try {
        const data = await UnitService.deactiveUnit(req.params.id);
        return success(res, data, "Unit deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}