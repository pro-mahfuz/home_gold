import * as GoldPriceInService from "./goldPriceIn.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllGoldPriceIn = async (req, res) => {
  try {
    const data = await GoldPriceInService.getAllGoldPriceIn(req);
    return success(res, data, "Gold price data retrieved successfully");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

export const getLatestGoldPriceIn = async (req, res) => {
  try {
    const data = await GoldPriceInService.getLatestGoldPriceIn(req);
    return success(res, data, "Latest gold price data retrieved successfully");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

export const createGoldPriceIn = async (req, res) => {
  try {
    const data = await GoldPriceInService.createGoldPriceIn(req);
    return success(res, data, "Gold price data stored successfully", 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

export const getGoldPriceInById = async (req, res) => {
  try {
    const data = await GoldPriceInService.getGoldPriceInById(req);
    return success(res, data, "Gold price data retrieved successfully");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

export const updateGoldPriceIn = async (req, res) => {
  try {
    const data = await GoldPriceInService.updateGoldPriceIn(req);
    return success(res, data, "Gold price data updated successfully");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

export const deleteGoldPriceIn = async (req, res) => {
  try {
    const data = await GoldPriceInService.deleteGoldPriceIn(req);
    return success(res, data, "Gold price data deleted successfully");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};
