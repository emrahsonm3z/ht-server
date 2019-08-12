import * as yup from "yup";
import {
  passwordNotLongEnough,
  emailNotLongEnough,
  invalidEmail
} from "./modules/user/register/errorMessages";

export const registerPasswordValidation = yup
  .string()
  .min(3, passwordNotLongEnough)
  .max(255);

export const emailValidation = yup
  .string()
  .min(3, emailNotLongEnough)
  .max(255)
  .email(invalidEmail);
