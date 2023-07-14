import axios, { AxiosError } from "axios";
import { action, makeObservable } from "mobx";
import { toast } from "react-toastify";
import { domain, headers } from "../constant";
import { authStore, walletStore, websocketStore } from ".";
import {
  createTimeoutPromise,
  errorChecking,
  handleSuccess,
} from "../functions";
import { ErrorResponse } from "../types";

class TradeStoreImplementation {
  constructor() {
    makeObservable(this, {
      buyToken: action.bound,
    });
  }

  async buyToken(
    input: number,
    current_price: number,
    coin_amount: number
  ): Promise<void> {
    const id = toast.loading("Please wait...");

    const values = {
      input_amount: input,
      coin_currency: websocketStore.subscribe_currency,
      current_price: current_price,
      coin_amount: coin_amount,
    };

    if (values.coin_amount >= walletStore.wallet.USD) {
      return toast.update(id, {
        render: "Insufficient USD wallet balance",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }

    try {
      const res = await Promise.race([
        axios.post(`${domain}/trade/buy`, values, {
          headers: headers(authStore.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      walletStore.setUserWallet({
        USD: Number(res.data.details.walletBalance.USD),
        BTC: Number(res.data.details.walletBalance.BTC),
        ETH: Number(res.data.details.walletBalance.ETH),
      });

      walletStore.fetchWallet();

      const message = handleSuccess(res.data.message);

      toast.update(id, {
        render: message,
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

  async sellToken(
    current_selling_price: number,
    coin_amount: number
  ): Promise<void> {
    const id = toast.loading("Please wait...");

    const values = {
      coin_currency: websocketStore.subscribe_currency,
      current_selling_price: current_selling_price,
      coin_amount: coin_amount,
    };

    try {
      const res = await Promise.race([
        axios.post(`${domain}/trade/sell`, values, {
          headers: headers(authStore.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      walletStore.setUserWallet({
        USD: Number(res.data.details.walletBalance.USD),
        BTC: Number(res.data.details.walletBalance.BTC),
        ETH: Number(res.data.details.walletBalance.ETH),
      });

      walletStore.fetchWallet();

      const message = handleSuccess(res.data.message);

      toast.update(id, {
        render: message,
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
}

const tradeStore = new TradeStoreImplementation();

export default tradeStore;
