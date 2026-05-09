import * as yup from "yup";

export const bankSchema = yup.object({
  accountName: yup
    .string()
    .required("Account name is required"),

  accountNo: yup
    .string()
    .required("Account No is required"),

  address: yup
    .string()
    .required("Address is required"),

  isActive: yup.boolean().default(false),
  
});
