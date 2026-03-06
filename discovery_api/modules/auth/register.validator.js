import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().min(2).max(50).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  //roleId: yup.string().required(),
});
