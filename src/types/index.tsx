import { Dispatch, SetStateAction } from "react";

export type InputData = {
  name?: string;
  email: string;
  password: string;
  passwordConfirm?: string;
};

export type ChildrenProps = {
  children: React.ReactNode;
};

export type ResetPassword = {
  email: string;
};

export type ChartData = {
  previous: number;
  price: number;
  time: EpochTimeStamp;
};

export type Candlesticks = {
  open: number;
  high: number;
  low: number;
  close: number;
  epoch: EpochTimeStamp;
};

export type ForgotPasswordDialogT = {
  forgotPassword: boolean;
  setForgotPassword: Dispatch<SetStateAction<boolean>>;
};

export type AuthDialogT = {
  open: boolean;
  active: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setActive: Dispatch<SetStateAction<string>>;
  setForgotPassword: Dispatch<SetStateAction<boolean>>;
};

export type ChartSettingsT = {
  openSettings: boolean;
  setOpenSettings: Dispatch<SetStateAction<boolean>>;
};

export type ProfileT = {
  openProfile: boolean;
  setOpenProfile: Dispatch<SetStateAction<boolean>>;
};

export type User = {
  BTC: number;
  ETH: number;
  USD: number;
  email: string;
  name: string;
  token: string;
};
