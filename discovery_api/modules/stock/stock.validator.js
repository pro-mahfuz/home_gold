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

  date: yup
    .date()
    .typeError("date is invalid")
    .required("date is required"),

  categoryId: yup
    .number()
    .nullable()
    .typeError("category ID must be a number")
    .integer("category ID must be an integer"),

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
    .typeError("fromWarehouseId must be a number")
    .integer("fromWarehouseId must be an integer")
    .required("fromWarehouseId is required"),

  toWarehouseId: yup
    .number()
    .typeError("toWarehouseId must be a number")
    .integer("toWarehouseId must be an integer")
    .required("toWarehouseId is required"),

  partyId: yup
    .number()
    .nullable()
    .typeError("partyId must be a number"),

  containerId: yup
    .number()
    .nullable()
    .typeError("containerId must be a number"),
});
