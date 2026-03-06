import axiosInstance from "../../../api/axios";
import { Stock } from './stockTypes';

export const fetchAll = async () => {
  try {

    const res = await axiosInstance.get('protected/stock/list');
    console.log("stockAPI: ", res.data.data);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const getStockReport = async () => {
  try {

    const res = await axiosInstance.post('protected/stock/getStockReport');
    console.log(res.data.data);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const create = async (createData: Stock) => {
  try {

    const res = await axiosInstance.post('protected/stock/create', createData);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const fetchById = async (id: number) => {
  try {

    const res = await axiosInstance.get(`protected/stock/${id}/view`);
    return res.data.data;

  } catch {
    throw new Error('Failed to fetch');
  }
};

export const update = async (updateData: Stock) => {
  try {

    const res = await axiosInstance.put(`protected/stock/update`, updateData);
    return res.data.data;

  } catch {
    throw new Error('Failed to update');
  }
};

export const destroy = async (id: number) => {
  try {

    const res = await axiosInstance.post(`protected/stock/${id}/delete`);
    return res.data.data;

  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

