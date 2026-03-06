import * as ContainerService from "./container.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllContainer = async (req, res, next) =>{
    try {
        const data = await ContainerService.getAllContainer();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createContainer = async (req, res, next) => {
    try {
        console.log("Container create Request: ", req.body);
        const data = await ContainerService.createContainer(req);
        return success(res, data, "Container created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getContainerById = async (req, res, next) => {
    try {
        const data = await ContainerService.getContainerById(req.params.id);
        return success(res, data, "Container retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateContainer = async (req, res, next) => {
    try {
        const data = await ContainerService.updateContainer(req);
        return success(res, data, "Container updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const activeContainer = async (req, res, next) => {
    try {
        const data = await ContainerService.activeContainer(req.params.id);
        return success(res, data, "Container activated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deactiveContainer = async (req, res, next) => {
    try {
        const data = await ContainerService.deactiveContainer(req.params.id);
        return success(res, data, "Container deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}