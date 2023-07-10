import axios, { AxiosError } from "axios";
import { authStore } from "./stores";
import { ErrorResponse } from "./types";

export const createTimeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out. Please try again later."));
    }, timeout);
  });
};

export const handleErrors = (error: string) => {
  switch (error) {
    case "AUTHENTICATION_FAILED":
      authStore.reset();
      return "Session expired please login again!";
    case "CANNOT_BUY_OWN_CONTRACT":
      return "Cannot buy your own contract!";
    case "ACCOUNT_NOT_VERIFIED":
      return "Please check your email to verify your account";
    case "EMAIL_NOT_EXIST":
      return "Email does not exist";
    case "DUPLICATE_EMAIL":
      return "Email registered";
    case "INVALID_PASSWORD":
      return "Invalid password";
    default:
      return error;
  }
};

export const errorChecking = (error: AxiosError<ErrorResponse>) => {
  let message: string;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      message = handleErrors(error.response.data.message);
    } else if (error.message) {
      message = error.message;
    } else {
      message = "An unknown error occurred in axios";
    }
  } else {
    message = "An unknown error occurred";
  }

  return message;
};
