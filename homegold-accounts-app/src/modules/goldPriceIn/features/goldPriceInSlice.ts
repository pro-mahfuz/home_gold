import { createSlice } from "@reduxjs/toolkit";
import { GoldPriceInState } from "./goldPriceInTypes";
import {
  createGoldPriceIn,
  destroyGoldPriceIn,
  fetchAllGoldPriceIn,
  fetchGoldPriceInById,
  fetchLatestGoldPriceIn,
  updateGoldPriceIn,
} from "./goldPriceInThunks";

const initialState: GoldPriceInState = {
  data: [],
  latest: null,
  status: "idle",
  error: null,
};

const goldPriceInSlice = createSlice({
  name: "goldPriceIn",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGoldPriceIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllGoldPriceIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchAllGoldPriceIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || action.error.message || null;
      })
      .addCase(fetchLatestGoldPriceIn.fulfilled, (state, action) => {
        state.latest = action.payload;
      })
      .addCase(fetchLatestGoldPriceIn.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || null;
      })
      .addCase(createGoldPriceIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.unshift(action.payload);
        state.latest = action.payload;
      })
      .addCase(createGoldPriceIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || action.error.message || null;
      })
      .addCase(fetchGoldPriceInById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGoldPriceInById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const existingIndex = state.data.findIndex((d) => d.id === action.payload.id);
        if (existingIndex >= 0) {
          state.data[existingIndex] = action.payload;
        } else {
          state.data.push(action.payload);
        }
      })
      .addCase(fetchGoldPriceInById.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || action.error.message || null;
      })
      .addCase(updateGoldPriceIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        const existingIndex = state.data.findIndex((d) => d.id === action.payload.id);
        if (existingIndex >= 0) {
          state.data[existingIndex] = action.payload;
        } else {
          state.data.unshift(action.payload);
        }
        state.latest = action.payload;
      })
      .addCase(updateGoldPriceIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || action.error.message || null;
      })
      .addCase(destroyGoldPriceIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((d) => d.id !== action.payload);
        if (state.latest?.id === action.payload) {
          state.latest = state.data[0] || null;
        }
      })
      .addCase(destroyGoldPriceIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || action.error.message || null;
      });
  },
});

export default goldPriceInSlice.reducer;
