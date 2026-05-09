import axiosInstance from "../../../api/axios";
import { Ledger } from './ledgerTypes';

export const fetchAll = async () => {
  try {

    const res = await axiosInstance.get('protected/ledger/list');
    console.log("currency_ledgers_api: ",res.data.data);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const create = async (createData: Ledger) => {
  try {

    const res = await axiosInstance.post('protected/ledger/create', createData);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const fetchById = async (id: number) => {
  try {

    const res = await axiosInstance.get(`protected/ledger/${id}/view`);
    return res.data.data;

  } catch {
    throw new Error('Failed to fetch');
  }
};

export const update = async (updateData: Ledger) => {
  try {

    const res = await axiosInstance.put(`protected/ledger/update`, updateData);
    return res.data.data;

  } catch {
    throw new Error('Failed to update');
  }
};

export const destroy = async (id: number) => {
  try {

    const res = await axiosInstance.post(`protected/ledger/${id}/delete`);
    return res.data.data;

  } catch {
    throw new Error('Failed to delete');
  }
};

