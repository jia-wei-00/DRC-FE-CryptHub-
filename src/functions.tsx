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

export const handleSuccess = (msg: string) => {
  switch (msg) {
    case "BUY_ORDER_SUCCESS":
      return "Buy order successful";
    case "DEPOSIT_SUCCESS":
      return "Successfully deposited";
    case "RESET_PASSWORD_SUCCESS":
      return "Successfully reset password";
    case "WITHDRAW_SUCCESS":
      return "Successfully withdrawn";
    case "LOGOUT_SUCCESS":
      return "Successfully Logout";
    case "USER_CREATED":
      return "Check your email to activate account";
    case "EMAIL_SENT":
      return "Check your email to reset password";
    case "CONTRACT_ADDED":
      return "Contract added sucessfully";
    case "CONTRACT_PURCHASE_SUCCESSFUL":
      return "Buy Sucessfully";
    case "CONTRACT_DELETED":
      return "Contract withdraw sucessfully";
    case "SELL_ORDER_SUCCESS":
      return "Sell order successful";
    default:
      return msg;
  }
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
