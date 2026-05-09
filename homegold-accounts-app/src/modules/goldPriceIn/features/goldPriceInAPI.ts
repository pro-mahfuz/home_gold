import axiosInstance from "../../../api/axios";
import { GoldPriceIn } from "./goldPriceInTypes";
import type { AxiosRequestConfig } from "axios";

export const fetchAll = async () => {
  try {
    const res = await axiosInstance.get("protected/gold-price-in/list");
    return res.data.data;
  } catch {
    throw new Error("No data available");
  }
};

export const fetchLatest = async () => {
  try {
    const res = await axiosInstance.get("protected/gold-price-in/latest");
    return res.data.data;
  } catch {
    throw new Error("No latest gold price data available");
  }
};

export const create = async (createData: GoldPriceIn, config?: AxiosRequestConfig) => {
  try {
    const res = await axiosInstance.post("protected/gold-price-in/create", createData, config);
    return res.data.data;
  } catch {
    throw new Error("Failed to create gold price data");
  }
};

export const fetchById = async (id: number) => {
  try {
    const res = await axiosInstance.get(`protected/gold-price-in/${id}/view`);
    return res.data.data;
  } catch {
    throw new Error("Failed to fetch gold price data");
  }
};

export const update = async (updateData: GoldPriceIn, config?: AxiosRequestConfig) => {
  try {
    const res = await axiosInstance.put("protected/gold-price-in/update", updateData, config);
    return res.data.data;
  } catch {
    throw new Error("Failed to update gold price data");
  }
};

export const destroy = async (id: number) => {
  try {
    const res = await axiosInstance.post(`protected/gold-price-in/${id}/delete`);
    return res.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete gold price data");
  }
};
