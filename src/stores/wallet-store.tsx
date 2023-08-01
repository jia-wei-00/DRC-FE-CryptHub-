import { action, makeObservable, observable, runInAction } from "mobx";
import { PriceT, Wallet } from "../types";
import { makePersistable } from "mobx-persist-store";
import { authStore, historyStore } from ".";
import { createTimeoutPromise, firebaseError } from "../functions";
import { toast } from "react-toastify";
import db, { union } from "../firebase";
import { FirebaseError } from "@firebase/util";
import firebase from "firebase/compat/app";

class WalletStoreImplementation {
  wallet: Wallet = { BTC: 0, ETH: 0, USD: 0 };

  user_data = db.collection("user_data").doc(authStore.user?.id);

  constructor() {
    makeObservable(this, {
      wallet: observable,
      setUserWallet: action.bound,
      fetchWallet: action.bound,
      deposit: action.bound,
      withdraw: action.bound,
      saveRecord: action.bound,
    });

    // Make the store persistable
    makePersistable(this, {
      name: `crypthub_user_wallet`,
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
      this.user_data.onSnapshot((snapshot) => {
        this.setUserWallet(snapshot.data()!.wallet as Wallet);
      });
    } catch (error: unknown) {
      toast.error(`Error: ${firebaseError(error as FirebaseError)}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async deposit(values: PriceT): Promise<void> {
    const id = toast.loading("Please wait...");
    const tmp_amount = this.wallet.USD;

    try {
      await Promise.race([
        this.user_data.update({
          wallet: {
            ...this.wallet,
            USD: this.wallet.USD + values.price,
          },
        }),
        createTimeoutPromise(10000),
      ]);

      this.saveRecord("deposit", values.price, tmp_amount);

      toast.update(id, {
        render: "Deposit Successful",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    } catch (error: unknown) {
      toast.error(`Error: ${firebaseError(error as FirebaseError)}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async withdraw(values: PriceT): Promise<void> {
    const id = toast.loading("Please wait...");
    const tmp_amount = this.wallet.USD;

    try {
      if (values.price > this.wallet.USD) {
        throw new Error(
          "Withraw amount must be smaller or equal to your wallet balance"
        );
      }

      await Promise.race([
        this.user_data.update({
          wallet: {
            ...this.wallet,
            USD: this.wallet.USD - values.price,
          },
        }),
        createTimeoutPromise(10000),
      ]);

      this.saveRecord("withdraw", values.price, tmp_amount);

      toast.update(id, {
        render: "Withdraw Successful",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    } catch (error: unknown) {
      toast.error(`Error: ${firebaseError(error as FirebaseError)}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async saveRecord(
    type: string,
    amount: number,
    before: number
  ): Promise<void> {
    try {
      const record = {
        type: type,
        amount: amount,
        before: before,
        after: type === "deposit" ? before + amount : before - amount,
        created_at: firebase.firestore.Timestamp.now().seconds,
      };

      await this.user_data.update({
        wallet_record: union(record),
      });

      historyStore.setWalletHistory([record, ...historyStore.wallet_history]);
    } catch (error: unknown) {
      toast.error(`Error: ${firebaseError(error as FirebaseError)}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
}

const walletStore = new WalletStoreImplementation();

export default walletStore;
