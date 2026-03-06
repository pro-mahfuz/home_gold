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
