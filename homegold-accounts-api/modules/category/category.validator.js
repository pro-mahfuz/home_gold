import * as yup from "yup";

export const categorySchema = yup.object({
  name: yup.string().min(2).max(50).required(),
  isActive: yup.boolean().default(false),
});