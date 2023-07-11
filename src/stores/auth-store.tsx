import { makeObservable, action, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makePersistable } from "mobx-persist-store";
import axios, { AxiosError } from "axios";
import {
  Action,
  ErrorResponse,
  InputData,
  ModalState,
  PriceT,
  ResetPassword,
  ResetPasswordFormT,
  Transaction,
  TransactionDateFromAPI,
  User,
  Wallet,
  WalletHistoryT,
} from "../types";
import { MODALACTIONS, domain, headers } from "../constant";
import { createTimeoutPromise, errorChecking } from "../functions";
import Cookies from "js-cookie";

class AuthStoreImplementation {
  user: User | null = null;
  wallet: Wallet = { BTC: 0, ETH: 0, USD: 0 };
  auth_modal: boolean = false;
  transaction: Transaction[] = [];
  wallet_history: WalletHistoryT[] = [];

  constructor() {
    makeObservable(this, {
      user: observable,
      wallet: observable,
      auth_modal: observable,
      transaction: observable,
      wallet_history: observable,
      fetchWalletHistory: action.bound,
      setUser: action.bound,
      signOut: action.bound,
      setAuthModal: action.bound,
      reset: action.bound,
      fetchTransaction: action.bound,
    });

    const user_data = Cookies.get("crypthub_user");

    this.setUser(user_data ? JSON.parse(user_data) : null);

    // Make the store persistable
    makePersistable(this, {
      name: "crypthub_user_wallet",
      properties: ["wallet"],
      storage: window.localStorage,
    });
  }

  reset() {
    runInAction(() => {
      this.user = null;
      this.auth_modal = true;
    });

    Cookies.remove("crypthub_user");
  }

  setAuthModal(value: boolean) {
    runInAction(() => {
      this.auth_modal = value;
    });
  }

  setUser = (authUser: User | null): void => {
    runInAction(() => {
      this.user = authUser;
    });
  };

  setUserWallet = (wallet: Wallet): void => {
    runInAction(() => {
      this.wallet = wallet;
    });
  };

  async resetPassword(values: ResetPasswordFormT): Promise<void> {
    const id = toast.loading("Please wait...");

    try {
      await Promise.race([
        axios.post(`${domain}/user/resetPassword`, values, {
          headers: headers(this.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      toast.update(id, {
        render: "Successfully Reset Password",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async signIn(values: InputData): Promise<void> {
    const toast_id = toast.loading("Please wait...");
    try {
      const userCredential = await Promise.race([
        axios.post(`${domain}/user/loginUser`, values),
        createTimeoutPromise(10000),
      ]);

      const { id, email, name, token, BTC, ETH, USD } =
        userCredential.data.details;

      this.setUser({ id, email, name, token });
      this.setUserWallet({ BTC, ETH, USD });

      Cookies.set("crypthub_user", JSON.stringify(this.user), { expires: 1 });

      this.setAuthModal(false);
      toast.update(toast_id, {
        render: `Welcome ${this.user!.name}`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.update(toast_id, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async deposit(values: PriceT): Promise<void> {
    const id = toast.loading("Please wait...");

    const amount = {
      amount: values.price,
    };

    try {
      const res = await Promise.race([
        axios.post(`${domain}/wallet/walletDeposit`, amount, {
          headers: headers(this.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      toast.update(id, {
        render: "Successfully Deposited",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      runInAction(() => {
        this.wallet.USD = res.data.details.balance;
      });
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async withdraw(values: PriceT): Promise<void> {
    const id = toast.loading("Please wait...");

    const amount = {
      amount: values.price,
    };

    try {
      const res = await Promise.race([
        axios.post(`${domain}/wallet/walletWithdraw`, amount, {
          headers: headers(this.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      toast.update(id, {
        render: "Successfully Withdraw",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      runInAction(() => {
        this.wallet.USD = res.data.details.balance;
      });
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async signOut(): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      await Promise.race([
        axios.post(
          `${domain}/user/logoutUser`,
          {}, // pass in empty body
          { headers: headers(this.user!.token!) }
        ),
        createTimeoutPromise(10000),
      ]);

      toast.update(id, {
        render: "Successfully Logout",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      runInAction(() => {
        this.setUser(null);
      });

      Cookies.remove("crypthub_user");
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async signUp(values: InputData): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      await Promise.race([
        axios.post(`${domain}/user/registerUser`, values),
        createTimeoutPromise(10000),
      ]);
      toast.update(id, {
        render: `Check your email to activate account`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
      this.setAuthModal(false);
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async forgotPassword(
    values: ResetPassword,
    modal: ModalState,
    dispatch: React.Dispatch<Action>
  ): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      await Promise.race([
        axios.post(`${domain}/user/forgotPassword`, values),
        createTimeoutPromise(10000),
      ]);
      toast.update(id, {
        render: `Check your email to reset password`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
      dispatch({
        type: MODALACTIONS.FORGOTPASSWORD,
        payload: !modal.forgot_password_modal,
      });
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async fetchTransaction(): Promise<void> {
    try {
      const res = await Promise.race([
        axios.get(`${domain}/transaction/getAllTransactions`, {
          headers: headers(this.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      const transaction = res.data.details.map(
        (data: TransactionDateFromAPI) => {
          const {
            transaction_id: id,
            trade_type: type,
            currency,
            coin_amount,
            transaction_amount,
            transaction_date: string_date,
            commission_deduction_5,
          } = data;

          const date = new Date(string_date).getTime();

          let commission = commission_deduction_5;

          if (commission === 0) {
            commission = "-";
          }

          return {
            id,
            type,
            currency,
            coin_amount,
            transaction_amount,
            commission,
            date,
          };
        }
      );

      runInAction(() => {
        this.transaction = transaction;
      });
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async fetchWalletHistory(): Promise<void> {
    try {
      const res = await Promise.race([
        axios.get(`${domain}/wallet/walletTransaction`, {
          headers: headers(this.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      const transaction = res.data.details.map((data: WalletHistoryT) => {
        const { dwt_type, dwt_before, dwt_after, dwt_amount, created_at } =
          data;

        const date = new Date(created_at).getTime();
        const before = Number(dwt_before);
        const after = Number(dwt_after);
        const amount = Number(dwt_amount);

        return {
          dwt_type,
          dwt_before: before,
          dwt_after: after,
          dwt_amount: amount,
          created_at: date,
        };
      });

      runInAction(() => {
        this.wallet_history = transaction;
      });
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
}

const authStore = new AuthStoreImplementation();

export default authStore;
