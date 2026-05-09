export type NumericValue = number | string | null | undefined;

export interface GoldPriceIn {
  id?: number;
  businessId?: number;
  goldSpotRate?: NumericValue;
  dollarRate?: NumericValue;
  ounceRateDirham?: NumericValue;
  ounceGram?: NumericValue;
  "999_rateGram"?: NumericValue;
  "995_rateGram"?: NumericValue;
  "920_rateGram"?: NumericValue;
  buyRate?: NumericValue;
  sellRate?: NumericValue;
  carretRate?: NumericValue;
  buy_MC?: NumericValue;
  sell_MC?: NumericValue;
  carret_MC?: NumericValue;
  buy_CC?: NumericValue;
  sell_CC?: NumericValue;
  carret_CC?: NumericValue;
  buyAddProfit?: NumericValue;
  sellAddProfit?: NumericValue;
  carretAddProfit?: NumericValue;
  buyPricePerGram?: NumericValue;
  sellPricePerGram?: NumericValue;
  carretPricePerGram?: NumericValue;
  boriGram?: NumericValue;
  buyTotalDirham?: NumericValue;
  sellTotalDirham?: NumericValue;
  carretTotalDirham?: NumericValue;
  buyBdtRate?: NumericValue;
  sellBdtRate?: NumericValue;
  carretBdtRate?: NumericValue;
  buyTotalBdtBori?: NumericValue;
  sellTotalBdtBori?: NumericValue;
  carretTotalBdtBori?: NumericValue;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoldPriceInState {
  data: GoldPriceIn[];
  latest: GoldPriceIn | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
