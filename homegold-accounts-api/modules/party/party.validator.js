import * as yup from "yup";

export const partySchema = yup.object({
  type: yup.string().min(2).max(50).required(),
  name: yup.string().required(),
  // countryCode: yup.string().min(2).max(5).required(),
  // phoneCode: yup.string().min(1).max(5).required(),
  // phoneNumber: yup.string().min(9).max(15).required(),
  isActive: yup.boolean().default(false),
});