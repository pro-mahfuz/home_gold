import * as yup from "yup";

export const invoiceSchema = yup.object({
  categoryId: yup
    .number()
    .integer("Category must be an integer")
    .required("Category is required"),

  invoiceType: yup
    .string()
    .min(2, "Invoice type must be at least 2 characters")
    .max(50, "Invoice type must be at most 50 characters")
    .required("Invoice type is required"),

  partyId: yup
    .number()
    .integer("Party ID must be an integer")
    .required("Party is required"),

  date: yup
    .date()
    .required("Date is required"),

  totalAmount: yup
    .number()
    .required("Total amount is required"),

  isActive: yup
    .boolean()
    .default(false),
});
