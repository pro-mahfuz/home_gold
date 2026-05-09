import * as yup from "yup";

export const profileSchema = yup.object({
  fullName: yup.string().trim().required("Full name is required"),
  birthDate: yup.date().required("Birth date is required"),
  gender: yup.string().trim().required("Gender is required"),
  nationality: yup.string().trim().required("Nationality is required"),
  countryCode: yup.string().trim().required("countryCode is required"),
  phoneCode: yup.string().trim().required("phoneCode is required"),
  phoneNumber: yup.string().trim().required("phoneNumber is required"),
  address: yup.string().trim().required("Address is required"),
  city: yup.string().trim().required("City is required"),
  country: yup.string().trim().required("Country is required"),
  postalCode: yup.string().trim().required("Postal code is required"),
  //profilePicture: yup.string().url("Must be a valid URL").required("Profile picture is required"),
});