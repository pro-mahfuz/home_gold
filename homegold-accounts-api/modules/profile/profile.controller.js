import * as ProfileService from "./profile.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const createProfile = async (req, res, next) =>{
    try {
        const profile = await ProfileService.createProfile(req);
        return success(res, profile, "Profile created successfully", 201);

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getProfileById = async (req, res, next) => {
    try {
        const profile = await ProfileService.getProfileById(req.params.id);
        return success(res, profile, "Profile retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateProfileById = async (req, res, next) => {
    try {
        const profile = await ProfileService.updateProfileById(req.params.id, req);
        return success(res, profile, "Profile updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

