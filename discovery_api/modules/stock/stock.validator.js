import * as yup from "yup";

export const stockSchema = yup.object({
  // invoiceType: yup
  //   .string()
  //   .required("invoice type is required"),

  // invoiceId: yup
  //   .number()
  //   .typeError("invoice ID must be a number")
  //   .integer("invoice ID must be an integer")
  //   .required("invoice ID is required"),

  movementType: yup
    .string()
    .required("movement type is required"),

  quantity: yup
    .number()
    .typeError("quantity must be a number")
    .required("quantity is required"),

  // warehouseId: yup
  //   .number()
  //   .typeError("warehouse ID must be a number")
  //   .integer("warehouse ID must be an integer")
  //   .required("warehouse ID is required"),

  itemId: yup
    .number()
    .typeError("item ID must be a number")
    .integer("item ID must be an integer")
    .required("item ID is required"),
  
});

export const stockTransferSchema = yup.object({
  businessId: yup
    .number()
    .typeError("business ID must be a number")
    .integer("business ID must be an integer")
    .required("business ID is required"),

  movementType: yup
    .string()
    .oneOf(["stock_transfer", "stock_transfer_return"], "movementType must be stock_transfer or stock_transfer_return")
    .required("movementType is required"),

  date: yup
    .date()
    .typeError("date is invalid")
    .required("date is required"),

  categoryId: yup
    .number()
    .nullable()
    .typeError("category ID must be a number")
    .integer("category ID must be an integer"),

  invoiceId: yup
    .number()
    .nullable()
    .typeError("invoice ID must be a number")
    .integer("invoice ID must be an integer"),

  itemId: yup
    .number()
    .typeError("item ID must be a number")
    .integer("item ID must be an integer")
    .required("item ID is required"),

  unit: yup
    .string()
    .required("unit is required"),

  quantity: yup
    .number()
    .typeError("quantity must be a number")
    .moreThan(0, "quantity must be greater than zero")
    .required("quantity is required"),

  fromWarehouseId: yup
    .number()
    .nullable()
    .typeError("fromWarehouseId must be a number")
    .integer("fromWarehouseId must be an integer"),

  warehouseId: yup
    .number()
    .nullable()
    .typeError("warehouseId must be a number")
    .integer("warehouseId must be an integer"),

  containerId: yup
    .number()
    .nullable()
    .typeError("containerId must be a number"),

  partyId: yup
    .number()
    .nullable()
    .typeError("partyId must be a number"),

})
  .test(
    "warehouse-required",
    "warehouseId is required",
    (value) => Number(value?.warehouseId ?? value?.fromWarehouseId) > 0
  )
  .test(
    "party-required-for-return",
    "partyId is required for stock transfer return",
    (value) => value?.movementType !== "stock_transfer_return" || Number(value?.partyId) > 0
  );
