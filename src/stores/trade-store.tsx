import axios, { AxiosError } from "axios";
import { action, makeObservable } from "mobx";
import { toast } from "react-toastify";
import { domain, headers } from "../constant";
import { authStore, websocketStore } from ".";
import { errorChecking } from "../functions";
import { ErrorResponse } from "../types";

class TradeStoreImplementation {
  constructor() {
    makeObservable(this, {
      buyToken: action.bound,
    });
  }

  async buyToken(current_price: number, input_price: number): Promise<void> {
    const id = toast.loading("Please wait...");

    const values = {
      coin_currency: websocketStore.subscribe_currency,
      current_price: current_price,
      coin_amount: input_price,
    };

    if (values.coin_amount >= authStore.wallet.USD) {
      return toast.update(id, {
        render: "BALANCE INSUFFICIENT",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }

    try {
      const res = await axios.post(`${domain}/trade/buy`, values, {
        headers: headers(authStore.user!.token!),
      });

      authStore.setUserWallet({
        USD: Number(res.data.details.walletBalance.USD),
        BTC: Number(res.data.details.walletBalance.BTC),
        ETH: Number(res.data.details.walletBalance.ETH),
      });

      authStore.fetchWallet();

      toast.update(id, {
        render: res.data.message,
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

  // coin_currency, current_selling_price, coin_amount
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

    const coin_balance =
      websocketStore.subscribe_currency === "ETH"
        ? authStore.wallet.ETH
        : authStore.wallet.BTC;

    if (coin_amount > coin_balance) {
      return toast.update(id, {
        render: "BALANCE INSUFFICIENT",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }

    try {
      const res = await axios.post(`${domain}/trade/sell`, values, {
        headers: headers(authStore.user!.token!),
      });

      authStore.setUserWallet({
        USD: Number(res.data.details.walletBalance.USD),
        BTC: Number(res.data.details.walletBalance.BTC),
        ETH: Number(res.data.details.walletBalance.ETH),
      });

      authStore.fetchWallet();

      toast.update(id, {
        render: res.data.message,
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
