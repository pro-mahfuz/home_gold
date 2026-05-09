import { RootState } from "../../../store/store";
import { GoldPriceIn } from "./goldPriceInTypes";

export const selectGoldPriceInStatus = (state: RootState) => state.goldPriceIn.status;
export const selectGoldPriceInError = (state: RootState) => state.goldPriceIn.error;
export const selectLatestGoldPriceIn = (state: RootState) => state.goldPriceIn.latest;

export const selectAllGoldPriceIn = (state: RootState): GoldPriceIn[] => state.goldPriceIn.data || [];

export const selectGoldPriceInById = (id: number) => (state: RootState) =>
  state.goldPriceIn.data.find((entry) => entry.id === id);

export const selectAllGoldPriceInByBusiness = (businessId: number) => (state: RootState) =>
  state.goldPriceIn.data.filter((entry) => entry.businessId === businessId);
