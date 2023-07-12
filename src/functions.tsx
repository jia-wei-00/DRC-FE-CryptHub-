import axios, { AxiosError } from "axios";
import { authStore, p2pStore } from "./stores";
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
    case "Contract had already been bought/withdrawed":
      p2pStore.fetchP2PMarket();
      return error;
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
    message = error;
  }

  return message;
};
