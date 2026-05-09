import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { GoldPriceIn } from "./goldPriceInTypes";
import * as goldPriceInAPI from "./goldPriceInAPI";

export const fetchAllGoldPriceIn = createAsyncThunk<GoldPriceIn[], void, { rejectValue: string }>(
  "goldPriceIn/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await goldPriceInAPI.fetchAll();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch gold price data"
      );
    }
  }
);

export const fetchLatestGoldPriceIn = createAsyncThunk<GoldPriceIn, void, { rejectValue: string }>(
  "goldPriceIn/fetchLatest",
  async (_, thunkAPI) => {
    try {
      return await goldPriceInAPI.fetchLatest();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch latest gold price data"
      );
    }
  }
);

export const createGoldPriceIn = createAsyncThunk<GoldPriceIn, GoldPriceIn, { rejectValue: string }>(
  "goldPriceIn/create",
  async (createData, thunkAPI) => {
    try {
      return await goldPriceInAPI.create(createData);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create gold price data"
      );
    }
  }
);

export const fetchGoldPriceInById = createAsyncThunk<GoldPriceIn, number, { rejectValue: string }>(
  "goldPriceIn/fetchById",
  async (id, thunkAPI) => {
    try {
      return await goldPriceInAPI.fetchById(id);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch gold price data"
      );
    }
  }
);

export const updateGoldPriceIn = createAsyncThunk<GoldPriceIn, GoldPriceIn, { rejectValue: string }>(
  "goldPriceIn/update",
  async (updatedData, thunkAPI) => {
    try {
      if (typeof updatedData.id !== "number") {
        return thunkAPI.rejectWithValue("Gold price ID is missing or invalid");
      }

      return await goldPriceInAPI.update(updatedData);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update gold price data"
      );
    }
  }
);

export const destroyGoldPriceIn = createAsyncThunk<number, number, { rejectValue: string }>(
  "goldPriceIn/delete",
  async (id, thunkAPI) => {
    try {
      await goldPriceInAPI.destroy(id);
      return id;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete gold price data"
      );
    }
  }
);
