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

export type ChartSettingsT = {
  openSettings: boolean;
  setOpenSettings: Dispatch<SetStateAction<boolean>>;
};

export type ProfileT = {
  openProfile: boolean;
  setOpenProfile: Dispatch<SetStateAction<boolean>>;
};

export type User = {
  id: number;
  email: string;
  name: string;
  token: string;
};

export type Wallet = {
  BTC: number;
  ETH: number;
  USD: number;
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

export type TransactionDateFromAPI = {
  coin_amount: number;
  commission_deduction_5: number | string;
  currency: string;
  trade_type: string;
  transaction_amount: number;
  transaction_date: string;
  transaction_id: number;
  user_id: number;
  wallet_id: number;
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

//sell on marketplace modal type
export type SellOnMarketT = {
  sellModal?: boolean;
  setSellModal: React.Dispatch<React.SetStateAction<boolean>>;
  active?: string;
};

//add p2p contract form type
export type AddP2PContractFormT = {
  currency: string;
  coin_amount: number;
  price: number;
  active?: string;
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

//p2p completed contracts history
export type P2PCompletedHistoryT = {
  coin_amount: number;
  completed_at: EpochTimeStamp;
  created_at: EpochTimeStamp;
  currency: string;
  selling_price: number;
  transaction_type: string;
};

//p2p completed contracts hitory table
export type P2PCompletedHistoryColumn = {
  id:
    | "coin_amount"
    | "completed_at"
    | "created_at"
    | "currency"
    | "transaction_type"
    | "selling_price";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
};

export type ModalState = {
  deposit_modal: boolean;
  withdraw_modal: boolean;
  forgot_password_modal: boolean;
  auth_modal_active: string;
};

export type Action = {
  type: string;
  payload: boolean | string;
};

export type HandleModalReducerT = {
  modal: ModalState;
  dispatch: Dispatch<Action>;
};

export type HandleModalDispatchT = {
  dispatch: Dispatch<Action>;
};

export type ErrorResponse = {
  message: string;
};
