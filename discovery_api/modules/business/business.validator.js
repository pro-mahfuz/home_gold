import * as yup from "yup";

export const businessSchema = yup.object({
  businessName: yup.string().required("Business Name is required"),
  ownerName: yup.string().required("Owner Name is required"),
  email: yup.string().email().required("Email is required"),
  countryCode: yup.string().required("countryCode is required"),
  phoneCode: yup.string().required("phoneCode is required"),
  phoneNumber: yup.string().required("phoneNumber is required"),
  // vatPercentage: yup.number().required("VAT Percentage is required"),
  address: yup.string().required(),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  postalCode: yup.string().required("Postal code is required"),
});