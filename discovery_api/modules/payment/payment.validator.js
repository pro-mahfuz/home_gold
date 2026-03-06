import * as yup from "yup";

export const paymentSchema = yup.object({
  // categoryId: yup
  //   .number()
  //   .typeError("Category ID must be a number")
  //   .integer("Category ID must be an integer")
  //   .required("Category is required"),

  paymentType: yup
    .string()
    .required("Payment type is required"),

  // invoiceId: yup
  //   .number()
  //   .typeError("Invoice ID must be a number")
  //   .integer("Invoice ID must be an integer")
  //   .required("Invoice ID is required"),

  paymentDate: yup
    .string()
    .required("Payment date is required"),

  amountPaid: yup
    .number()
    .typeError("Amount must be a number")
    .positive()
    .required("Amount is required"),

  // paymentMethod: yup
  //   .string()
  //   .required("Payment method is required"),

  isActive: yup
    .boolean()
    .default(false)
});
