import { action, makeObservable, observable, runInAction } from "mobx";
import { ErrorResponse, PriceT, Wallet } from "../types";
import { makePersistable } from "mobx-persist-store";
import { authStore } from ".";
import axios, { AxiosError } from "axios";
import { domain, headers } from "../constant";
import {
  createTimeoutPromise,
  errorChecking,
  handleSuccess,
} from "../functions";
import { toast } from "react-toastify";

class WalletStoreImplementation {
  wallet: Wallet = { BTC: 0, ETH: 0, USD: 0 };

  constructor() {
    makeObservable(this, {
      wallet: observable,
      setUserWallet: action.bound,
      fetchWallet: action.bound,
      deposit: action.bound,
      withdraw: action.bound,
    });

    // Make the store persistable
    makePersistable(this, {
      name: `crypthub_${authStore.user!.id}_wallet`,
      properties: ["wallet"],
      storage: window.localStorage,
    });
  }

  setUserWallet = (wallet: Wallet): void => {
    runInAction(() => {
      this.wallet = wallet;
    });
  };

  async fetchWallet(): Promise<void> {
    try {
      const res = await Promise.race([
        axios.get(`${domain}/wallet/currentWalletBalance`, {
          headers: headers(authStore.user!.token),
        }),
        createTimeoutPromise(10000),
      ]);

      this.setUserWallet(res.data.details);
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_RIGHT,
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
          headers: headers(authStore.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      const message = handleSuccess(res.data.message);

      toast.update(id, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      runInAction(() => {
        this.wallet.USD = res.data.details.balance;
      });

      this.fetchWallet();
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
          headers: headers(authStore.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      const message = handleSuccess(res.data.message);

      toast.update(id, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      runInAction(() => {
        this.wallet.USD = res.data.details.balance;
      });

      this.fetchWallet();
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
}

const walletStore = new WalletStoreImplementation();

export default walletStore;
