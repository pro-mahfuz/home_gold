import * as ItemService from "./item.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllItem = async (req, res, next) =>{
    try {
        const data = await ItemService.getAllItem();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createItem = async (req, res, next) => {
    try {
        console.log("Item create Request: ", req.body);
        const data = await ItemService.createItem(req);
        return success(res, data, "Item created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getItemById = async (req, res, next) => {
    try {
        const data = await ItemService.getItemById(req.params.id);
        return success(res, data, "Item retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateItem = async (req, res, next) => {
    try {
        const data = await ItemService.updateItem(req);
        return success(res, data, "Item updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const activeItem = async (req, res, next) => {
    try {
        const data = await ItemService.activeItem(req.params.id);
        return success(res, data, "Item activated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deactiveItem = async (req, res, next) => {
    try {
        const data = await ItemService.deactiveItem(req.params.id);
        return success(res, data, "Item deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}