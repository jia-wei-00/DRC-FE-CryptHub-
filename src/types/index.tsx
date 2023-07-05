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
  epoch?: EpochTimeStamp;
};

export type ForgotPasswordDialogT = {
  forgotPassword: boolean;
  setForgotPassword: Dispatch<SetStateAction<boolean>>;
};

export type AuthDialogT = {
  active: string;
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
  email?: string;
  name?: string;
  token?: string;
};

export type BuyTokenT = {
  coin_currency: string;
  current_price: number;
  coin_amount: number;
};

export type PriceT = {
  price: number;
};

export type BuySellBoxT = {
  current_price: number;
  current_candles: Candlesticks;
};

export type LoginFormProps = {
  setResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

export type Column = {
  id:
    | "id"
    | "type"
    | "date"
    | "currency"
    | "commission"
    | "transaction_amount"
    | "coin_amount";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
};

export type Transaction = {
  coin_amount: number;
  commission: number | string;
  currency: string;
  date: EpochTimeStamp;
  id: number;
  transaction_amount: number;
  type: string;
};

export type WalletHistoryColumn = {
  id: "dwt_type" | "dwt_before" | "dwt_after" | "dwt_amount" | "created_at";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
};

export type WalletHistoryT = {
  dwt_type: string;
  dwt_before: number;
  dwt_after: number;
  dwt_amount: number;
  created_at: EpochTimeStamp | string;
};

//reset password form type
export type ResetPasswordFormT = {
  old_password: string;
  password: string;
  new_password: string;
};

//deposit modal type
export type DepositDialogT = {
  depositModal?: boolean;
  setDepositModal: React.Dispatch<React.SetStateAction<boolean>>;
};

//withdrawal modal type
export type WithdrawDialogT = {
  withdrawModal?: boolean;
  setWithdrawModal: React.Dispatch<React.SetStateAction<boolean>>;
};

//sell on marketplace modal type
export type SellOnMarketT = {
  sellModal?: boolean;
  setSellModal: React.Dispatch<React.SetStateAction<boolean>>;
};

//add p2p contract form type
export type AddP2PContractFormT = {
  currency: string;
  coin_amount: number;
  price: number;
};

//p2p market item card type
export type ItemCardT = {
  active: string;
  contract: P2PContractsT;
};

//p2p contracts type
export type P2PContractsT = {
  coin_amount: number;
  contract_id: string;
  created_at: EpochTimeStamp;
  currency: string;
  seller_id: number;
  selling_price: number;
};
