import * as yup from "yup";

export const userSchema = yup.object({
  name: yup.string().min(2).max(50).required(),
  email: yup.string().email().required(),
  countryCode: yup.string().min(2).max(5).required(),
  phoneCode: yup.string().min(1).max(5).required(),
  phoneNumber: yup.string().min(9).max(15).required(),
  password: yup.string().nullable(),
  roleId: yup.number().required(),
  isActive: yup.boolean().default(false),
});
