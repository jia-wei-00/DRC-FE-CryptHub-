import { action, makeObservable, observable, runInAction } from "mobx";
import {
  P2PCompletedHistoryT,
  Transaction,
  TransactionDateFromAPI,
  WalletHistoryT,
} from "../types";
import { authStore, loadingStore } from ".";
import { createTimeoutPromise, firebaseError } from "../functions";
import { toast } from "react-toastify";
import { FirebaseError } from "@firebase/util";

class HistoryStoreImplementation {
  transaction: Transaction[] = [];
  wallet_history: WalletHistoryT[] = [];
  p2p_completed_history: P2PCompletedHistoryT[] = [];

  constructor() {
    makeObservable(this, {
      transaction: observable,
      wallet_history: observable,
      p2p_completed_history: observable,
      fetchTransaction: action.bound,
      fetchWalletHistory: action.bound,
      fetchP2PHistory: action.bound,
      setP2PCompletedHistory: action.bound,
      setWalletHistory: action.bound,
      setTransaction: action.bound,
    });
  }

  setP2PCompletedHistory(values: P2PCompletedHistoryT[]) {
    runInAction(() => {
      this.p2p_completed_history = values;
    });
  }

  setWalletHistory(values: WalletHistoryT[]) {
    runInAction(() => {
      this.wallet_history = values;
    });
  }

  setTransaction(values: Transaction[]) {
    runInAction(() => {
      this.transaction = values;
    });
  }

  async fetchTransaction(): Promise<void> {
    loadingStore.setHistoryLoading(true);

    try {
      await Promise.race([
        authStore.db_user_data!.get().then((res) => {
          const data = res.data()?.crypthub_trader_record;

          const reorder = data?.sort(
            (
              a: { transaction_date: number },
              b: { transaction_date: number }
            ) => b.transaction_date - a.transaction_date
          );

          const transaction = reorder.map((data: TransactionDateFromAPI) => {
            const {
              trade_type: type,
              currency,
              coin_amount,
              transaction_amount,
              transaction_date: date,
              commission_deduction_5,
            } = data;
            let commission = commission_deduction_5;
            if (commission === 0) {
              commission = "-";
            }
            return {
              type,
              currency,
              coin_amount,
              transaction_amount,
              commission,
              date,
            };
          });
          this.setTransaction(transaction);
          loadingStore.setHistoryLoading(false);
        }),
        createTimeoutPromise(10000),
      ]);
    } catch (error: unknown) {
      loadingStore.setHistoryLoading(false);

      toast.error(`Error: ${firebaseError(error as FirebaseError)}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async fetchWalletHistory(): Promise<void> {
    loadingStore.setHistoryLoading(true);
    try {
      await Promise.race([
        authStore.db_user_data!.get().then((res) => {
          const data = res.data()?.wallet_record;

          const reorder = data?.sort(
            (a: { created_at: number }, b: { created_at: number }) =>
              b.created_at - a.created_at
          );

          this.setWalletHistory(reorder);

          loadingStore.setHistoryLoading(false);
        }),
        createTimeoutPromise(10000),
      ]);
    } catch (error: unknown) {
      loadingStore.setHistoryLoading(false);

      toast.error(`Error: ${firebaseError(error as FirebaseError)}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async fetchP2PHistory(): Promise<void> {
    loadingStore.setHistoryLoading(true);
    try {
      await Promise.race([
        authStore.db_user_data?.onSnapshot((snapshot) => {
          const values = snapshot
            .data()!
            .p2p_trader_record.map((value: P2PCompletedHistoryT) => {
              return {
                coin_amount: value.coin_amount,
                completed_at: value.completed_at,
                created_at: value.created_at,
                currency: value.currency,
                selling_price: value.selling_price,
                transaction_type: value.transaction_type,
              };
            });

          const reorder = values?.sort(
            (a: { completed_at: number }, b: { completed_at: number }) =>
              b.completed_at - a.completed_at
          );

          this.setP2PCompletedHistory(reorder);
          loadingStore.setHistoryLoading(false);
        }),
        createTimeoutPromise(10000),
      ]);
    } catch (error: unknown) {
      loadingStore.setHistoryLoading(false);

      toast.error(`Error: ${firebaseError(error as FirebaseError)}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
}

const historyStore = new HistoryStoreImplementation();

export default historyStore;
