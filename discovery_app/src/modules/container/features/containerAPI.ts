import axiosInstance from "../../../api/axios";
import { Container } from './containerTypes';

export const fetchAll = async () => {
  try {

    const res = await axiosInstance.get('protected/container/list');
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const create = async (createData: Container) => {
  try {

    const res = await axiosInstance.post('protected/container/create', createData);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const fetchById = async (id: number) => {
  try {

    const res = await axiosInstance.get(`protected/container/${id}/view`);
    return res.data.data;

  } catch {
    throw new Error('Failed to fetch');
  }
};

export const update = async (updateData: Container) => {
  try {

    const res = await axiosInstance.put(`protected/container/update`, updateData);
    return res.data.data;

  } catch {
    throw new Error('Failed to update');
  }
};

export const destroy = async (id: number) => {
  try {

    const res = await axiosInstance.post(`protected/container/${id}/delete`);
    return res.data.data;

  } catch {
    throw new Error('Failed to delete');
  }
};

