import * as yup from "yup";

export const warehouseSchema = yup.object({
  name: yup
    .string()
    .required("invoice type is required"),

  location: yup
    .string()
    .required("movement type is required"),

  isActive: yup.boolean().default(false),
  
});
