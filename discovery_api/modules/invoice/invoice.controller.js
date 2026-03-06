import * as InvoiceService from "./invoice.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllInvoice = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const type = req.query.type ?? "all"; // e.g. "sale", "purchase", "bill", "all"
    const filterText = req.query.filterText ?? "";

    let data;

    if ((!page || page === 0) && (!limit || limit === 0)) {
      // No pagination or filter
      data = await InvoiceService.getAllInvoice();
    } else {
       
      // With pagination and/or filter
      data = await InvoiceService.getAllInvoiceWithPagination(page, limit, type, filterText);
    }

    return success(res, data, "Response successful");
  } catch (err) {
    return error(res, err.message || "Internal Server Error", err.status || 500);
  }
};

export const getPurchaseReport = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getPurchaseReport();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getSaleReport = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getSaleReport();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getSaleContainerReport = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getSaleContainerReport();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getSaleCashReport = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getSaleCashReport();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getBillReport = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getBillReport();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getProfitLossReport = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getProfitLossReport();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getDailyProfitLossReport = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getDailyProfitLossReport();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}


export const getSalePaymentReport = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getSalePaymentReport();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createInvoice = async (req, res, next) => {
    try {
        const data = await InvoiceService.createInvoice(req);
        return success(res, data, "Invoice created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getInvoiceById = async (req, res, next) => {
    try {
        const data = await InvoiceService.getInvoiceById(req.params.id);
        return success(res, data, "Invoice retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateInvoice = async (req, res, next) => {
    try {
        const data = await InvoiceService.updateInvoice(req);
        return success(res, data, "Invoice updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}


export const deleteInvoice = async (req, res, next) => {
    try {
        const data = await InvoiceService.deleteInvoice(req);
        return success(res, data, "Invoice deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}