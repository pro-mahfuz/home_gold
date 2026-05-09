import * as AuthService from "./auth.service.js";
import { success } from "../../utils/responseHandler.js";

export  const register = async (req, res, next) => {
    
    try {
        const user = await AuthService.register(req.body);
        return success(res, user, "Register successful");
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const data = await AuthService.login(req.body);
        return success(res, data, "Login successful");
    } catch (err) {
        next(err);
    }
}

export const isAccessTokenExpired = async (req, res, next) => {
    try {
        const isExpired = await AuthService.isAccessTokenExpired(req.body);
        return success(res, { isExpired }, "Access token expiration status retrieved successfully");
    } catch (err) {
        next(err);
    }
}

export const refreshToken = async (req, res, next) => {
    try {
        const data = await AuthService.refreshToken(req.body);
        return success(res, data, "Access token refreshed successfully");
    } catch (err) {
        next(err);
    }
};


export const logout = async (req, res, next) => {

    try{
        await AuthService.logout(req.body);
        return success(res, null, "Logged out successfully");
    } catch (err) {
        next(err);
    }

};

export const logoutAll = async (req, res, next) => {
    try {
        
        const userId = req.user?.id; // comes from auth middleware
        await AuthService.logoutFromAllDevices(userId);
        return success(res, null, "Logged out from all devices");
    } catch (err) {
        next(err);
    }
};
