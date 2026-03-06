import * as yup from "yup";

export const itemSchema = yup.object({
  // code: yup.string().min(2).max(50).required("Code is required"),
  name: yup.string().min(2).max(50).required("Name is required"),
  categoryId: yup.number().integer("Category must be an integer").required("Category is required"),
  isActive: yup.boolean().default(false),
});