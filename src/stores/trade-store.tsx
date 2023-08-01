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
import { ErrorResponse, Wallet } from "../types";
import db, { union } from "../firebase";
import firebase from "firebase/compat/app";

class TradeStoreImplementation {
  constructor() {
    makeObservable(this, {
      buyToken: action.bound,
    });
  }

  user_data = db.collection("user_data").doc(authStore.user?.id);

  async buyToken(input: number, coin_amount: number): Promise<void> {
    const id = toast.loading("Please wait...");

    if (coin_amount >= walletStore.wallet.USD) {
      return toast.update(id, {
        render: "Insufficient USD wallet balance",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }

    try {
      await this.user_data.update({
        wallet: {
          ...walletStore.wallet,
          USD: walletStore.wallet.USD - input,
          [websocketStore.subscribe_currency]:
            walletStore.wallet[
              websocketStore.subscribe_currency as keyof Wallet
            ] + coin_amount,
        },
      });

      this.saveRecord("buy", coin_amount, input);

      toast.update(id, {
        render: "Buy coin successful",
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

    try {
      await this.user_data.update({
        wallet: {
          ...walletStore.wallet,
          USD: walletStore.wallet.USD + coin_amount * current_selling_price,
          [websocketStore.subscribe_currency]:
            walletStore.wallet[
              websocketStore.subscribe_currency as keyof Wallet
            ] - coin_amount,
        },
      }),
        this.saveRecord(
          "sell",
          coin_amount,
          current_selling_price * coin_amount
        );

      toast.update(id, {
        render: "Sell coin successful",
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

  async saveRecord(
    type: string,
    coin_amount: number,
    transaction_amount: number
  ): Promise<void> {
    const commission = type === "buy" ? 0 : (transaction_amount * 5) / 100;

    await this.user_data.update({
      crypthub_trader_record: union({
        trade_type: type,
        currency: websocketStore.subscribe_currency,
        coin_amount: coin_amount,
        transaction_amount: transaction_amount - commission,
        transaction_date: firebase.firestore.Timestamp.now().seconds,
        commission_deduction_5: commission,
      }),
    });
  }
}

const tradeStore = new TradeStoreImplementation();

export default tradeStore;
