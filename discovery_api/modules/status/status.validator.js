import * as yup from "yup";

export const statusTypeSchema = yup.object({
  name: yup.string().min(2).max(50).required("Label is required"),
  value: yup.string().min(2).max(50).required("Value is required"),
  group: yup.string().min(2).max(50).required("Group is required"),
  isActive: yup.boolean().default(false),
});