import * as CategoryService from "./category.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllCategory = async (req, res, next) =>{
    try {
        const data = await CategoryService.getAllCategory();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createCategory = async (req, res, next) => {
    try {
        console.log("Category create Request: ", req.body);
        const data = await CategoryService.createCategory(req);
        return success(res, data, "Category created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getCategoryById = async (req, res, next) => {
    try {
        const data = await CategoryService.getCategoryById(req.params.id);
        return success(res, data, "Category retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateCategory = async (req, res, next) => {
    try {
        const data = await CategoryService.updateCategory(req);
        return success(res, data, "Category updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const activeCategory = async (req, res, next) => {
    try {
        const data = await CategoryService.activeCategory(req.params.id);
        return success(res, data, "Category activated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deactiveCategory = async (req, res, next) => {
    try {
        const data = await CategoryService.deactiveCategory(req.params.id);
        return success(res, data, "Category deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}