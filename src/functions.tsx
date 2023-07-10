import { authStore } from "./stores";

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
    default:
      return error;
  }
};
