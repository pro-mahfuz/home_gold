import * as BusinessService from "./business.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllBusiness = async (req, res, next) =>{
    try {
        const data = await BusinessService.getAllBusiness();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createBusiness = async (req, res, next) => {
    try {
        const data = await BusinessService.createBusiness(req);
        return success(res, data, "Business created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getBusinessById = async (req, res, next) => {
    try {
        const data = await BusinessService.getBusinessById(req.params.id);
        return success(res, data, "Business retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateBusiness = async (req, res, next) => {
    console.log("Business update Request: ", req.body);
    try {
        const data = await BusinessService.updateBusiness(req);
        return success(res, data, "Business updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const activeBusiness = async (req, res, next) => {
    try {
        const data = await BusinessService.activeBusiness(req.params.id);
        return success(res, data, "Business activated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deactiveBusiness = async (req, res, next) => {
    try {
        const data = await BusinessService.deactiveBusiness(req.params.id);
        return success(res, data, "Business deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deleteBusiness = async (req, res, next) => {
    try {
        const data = await BusinessService.deleteBusiness(req.params.id);
        return success(res, data, "Business deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}