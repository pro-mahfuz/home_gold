import * as yup from "yup";

export const unitSchema = yup.object({
  name: yup.string().min(2).max(50).required("Name is required"),
  isActive: yup.boolean().default(false),
});