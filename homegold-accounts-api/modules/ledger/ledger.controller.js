import * as LedgerService from "./ledger.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllLedger = async (req, res, next) =>{
    try {
        const data = await LedgerService.getAllLedger();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createLedger = async (req, res, next) => {
    try {
        console.log("Ledger create Request: ", req.body);
        const data = await LedgerService.createLedger(req);
        return success(res, data, "Ledger created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getLedgerById = async (req, res, next) => {
    try {
        const data = await LedgerService.getLedgerById(req.params.id);
        return success(res, data, "Ledger retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateLedger = async (req, res, next) => {
    try {
        const data = await LedgerService.updateLedger(req);
        return success(res, data, "Ledger updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}


export const deleteLedger = async (req, res, next) => {
    try {
        const data = await LedgerService.deleteLedger(req);
        return success(res, data, "Ledger deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}