import { action, makeObservable, observable, runInAction } from "mobx";
import { PriceT, Wallet } from "../types";
import { makePersistable } from "mobx-persist-store";
import { authStore } from ".";
import { createTimeoutPromise, firebaseError } from "../functions";
import { toast } from "react-toastify";
import db from "../firebase";
import { FirebaseError } from "@firebase/util";

class WalletStoreImplementation {
  wallet: Wallet = { BTC: 0, ETH: 0, USD: 0 };

  db_wallet = db.collection("user_data").doc(authStore.user?.id);

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
      this.db_wallet.onSnapshot((snapshot) => {
        if (snapshot.exists) {
          this.wallet = snapshot.data() as Wallet;
        } else {
          throw new Error("No such document!");
        }
      });
    } catch (error: unknown) {
      toast.error(`Error: ${firebaseError(error as FirebaseError)}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async deposit(values: PriceT): Promise<void> {
    const id = toast.loading("Please wait...");

    try {
      await Promise.race([
        this.db_wallet.update({
          ...this.wallet,
          USD: this.wallet.USD + values.price,
        }),
        createTimeoutPromise(10000),
      ]);

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

    try {
      await Promise.race([
        this.db_wallet.update({
          ...this.wallet,
          USD: this.wallet.USD - values.price,
        }),
        createTimeoutPromise(10000),
      ]);

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
}

const walletStore = new WalletStoreImplementation();

export default walletStore;
