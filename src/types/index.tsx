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

export type Candles = {
  open: number;
  high: number;
  low: number;
  close: number;
  time: EpochTimeStamp;
};
