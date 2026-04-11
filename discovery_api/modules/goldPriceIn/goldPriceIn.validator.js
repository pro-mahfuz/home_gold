import * as yup from "yup";

const numericField = (label) =>
  yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null || originalValue === undefined
        ? null
        : value
    )
    .nullable()
    .typeError(`${label} must be a number`);

export const goldPriceInSchema = yup.object({
  id: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null || originalValue === undefined
        ? null
        : value
    )
    .nullable()
    .integer("ID must be an integer")
    .typeError("ID must be a number"),

  businessId: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null || originalValue === undefined
        ? null
        : value
    )
    .nullable()
    .integer("Business ID must be an integer")
    .typeError("Business ID must be a number"),

  goldSpotRate: numericField("Gold spot rate"),
  dollarRate: numericField("Dollar rate"),
  ounceRateDirham: numericField("Ounce rate dirham"),
  ounceGram: numericField("Ounce gram"),
  "999_rateGram": numericField("999 rate gram"),
  "995_rateGram": numericField("995 rate gram"),
  "992_rateGram": numericField("992 rate gram"),
  buyRate: numericField("Buy rate"),
  sellRate: numericField("Sell rate"),
  carretRate: numericField("Carret rate"),
  buy_MC: numericField("Buy MC"),
  sell_MC: numericField("Sell MC"),
  carret_MC: numericField("Carret MC"),
  buy_CC: numericField("Buy CC"),
  sell_CC: numericField("Sell CC"),
  carret_CC: numericField("Carret CC"),
  buyAddProfit: numericField("Buy add profit"),
  sellAddProfit: numericField("Sell add profit"),
  carretAddProfit: numericField("Carret add profit"),
  buyPricePerGram: numericField("Buy price per gram"),
  sellPricePerGram: numericField("Sell price per gram"),
  carretPricePerGram: numericField("Carret price per gram"),
  boriGram: numericField("Bori gram"),
  buyTotalDirham: numericField("Buy total dirham"),
  sellTotalDirham: numericField("Sell total dirham"),
  carretTotalDirham: numericField("Carret total dirham"),
  buyBdtRate: numericField("Buy BDT rate"),
  sellBdtRate: numericField("Sell BDT rate"),
  carretBdtRate: numericField("Carret BDT rate"),
  buyTotalBdtBori: numericField("Buy total BDT bori"),
  sellTotalBdtBori: numericField("Sell total BDT bori"),
  carretTotalBdtBori: numericField("Carret total BDT bori"),
});
